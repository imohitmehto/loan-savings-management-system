import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  SendOtpDto,
  VerifyOtpDto,
} from "./dtos";
import { Hash } from "src/common/utils/hash.util";
import { ConfigService } from "@nestjs/config";
import {
  EmailRequiredException,
  InvalidCredentialsException,
  InvalidTokenException,
  UserAlreadyExistsException,
  AccountSuspendedException,
} from "./exceptions/auth.exceptions";
import {
  JwtPayload,
  LoginResponse,
  RegisterResponse,
} from "./interfaces/auth.interface";
import { PrismaService } from "src/infrastructure/database/prisma.service";
import { MailService } from "src/infrastructure/mail/mail.service";
import { SmsService } from "src/infrastructure/sms/sms.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // Config values
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtRefreshExpiresIn: string;

  // OTP policy
  private readonly otpTtlMs: number; // milliseconds
  private readonly otpResendCooldownMs: number; // cooldown between sending OTPs
  private readonly otpMaxResend: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly hashService: Hash,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) {
    this.jwtSecret = this.config.get<string>("app.jwt.secret");
    this.jwtRefreshSecret = this.config.get<string>("app.jwt.refreshSecret");
    this.jwtExpiresIn = this.config.get<string>("app.jwt.expiresIn");
    this.jwtRefreshExpiresIn = this.config.get<string>(
      "app.jwt.refreshExpiresIn",
    );

    this.otpTtlMs = this.config.get<number>("app.otp.ttlMs");
    this.otpResendCooldownMs = this.config.get<number>(
      "app.otp.resendCooldownMs",
    );
    this.otpMaxResend = this.config.get<number>("app.otp.maxResend");
  }

  // -------------------- Public API -------------------- //

  /**
   * Registers a new user and triggers OTP verification. Transaction-safe.
   */
  async register(
    dto: RegisterDto,
  ): Promise<{ message: string; data: RegisterResponse }> {
    const { firstName, lastName, email, phone, password, role } = dto;

    if (!email) throw new EmailRequiredException();
    if (!password) throw new BadRequestException("Password is required");

    // Check existing user
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new UserAlreadyExistsException("email");

    const hashedPassword = await this.hashService.hashPassword(password);

    // Create user & initial OTP inside a DB transaction to avoid orphaned OTPs
    let user;
    try {
      user = await this.prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            isActive: false,
            isVerified: false,
            role,
          },
        });

        // create initial OTP record using otpService which may encapsulate provider details
        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + this.otpTtlMs);

        await tx.otp.create({
          data: {
            userId: created.id,
            otp,
            expiresAt,
            lastSentAt: new Date(),
            resendCount: 0,
            email,
            phone,
          },
        });

        // return created user so we can send OTP
        return created;
      });
    } catch (err) {
      this.logger.error("Failed to create user", err);
      throw new InternalServerErrorException("Failed to create user");
    }

    // Send OTP asynchronously but still catch errors so caller gets meaningful message
    try {
      await this.dispatchOtp(
        user.email,
        user.phone,
        `${user.firstName} ${user.lastName}`,
        await this.latestOtpForUser(user.id),
      );
    } catch (err) {
      this.logger.error(`Failed to dispatch OTP to user ${user.id}`, err);
      throw new InternalServerErrorException(
        "Failed to send OTP. Please try resending OTP.",
      );
    }

    const response: RegisterResponse = {
      role: user.role,
      isVerified: user.isVerified,
    };

    return {
      message: "User registered successfully. OTP sent to email/phone.",
      data: response,
    };
  }

  /**
   * Verify OTP provided by user. Marks user verified and active on success.
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<{ message: string }> {
    const { email, otp } = dto;
    if (!email) throw new EmailRequiredException();
    if (!otp) throw new BadRequestException("OTP is required");

    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new NotFoundException("No user found with the provided email");

    // Get latest OTP
    const otpRecord = await this.prisma.otp.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord)
      throw new BadRequestException("No OTP found. Please request a new one.");

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException("OTP has expired");
    }

    if (otpRecord.verifiedAt) {
      return { message: "OTP already verified" };
    }

    if (otpRecord.otp !== otp) {
      // increase failed attempts counter if you maintain one
      throw new BadRequestException("Invalid OTP");
    }

    // Mark OTP verified and activate user in a transaction
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.otp.update({
          where: { id: otpRecord.id },
          data: { verifiedAt: new Date() },
        });
        await tx.user.update({
          where: { id: user.id },
          data: { isVerified: true, isActive: true, lastLogin: new Date() },
        });
      });
    } catch (err) {
      this.logger.error("Failed to mark OTP verified/activate user", err);
      throw new InternalServerErrorException("Failed to verify account");
    }

    return { message: "Account verified successfully" };
  }

  /**
   * Public endpoint to request an OTP for an email.
   */
  async requestOtp(dto: SendOtpDto): Promise<{ message: string }> {
    if (!dto.email) throw new EmailRequiredException();

    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new NotFoundException("Invalid email");

    // Rate-limit / cooldown checks
    const latestOtp = await this.prisma.otp.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (latestOtp) {
      const sinceLastMs = Date.now() - latestOtp.lastSentAt.getTime();
      if (sinceLastMs < this.otpResendCooldownMs) {
        throw new BadRequestException(
          "Please wait before requesting another OTP",
        );
      }
      if ((latestOtp.resendCount ?? 0) >= this.otpMaxResend) {
        throw new BadRequestException(
          "OTP resend limit reached. Contact support.",
        );
      }
    }

    // Generate and store OTP
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + this.otpTtlMs);

    await this.storeOrUpdateOtp(
      user.id,
      otp,
      expiresAt,
      user.email,
      user.phone,
    );

    // Dispatch the OTP
    await this.dispatchOtp(
      user.email,
      user.phone,
      `${user.firstName} ${user.lastName}`,
      otp,
    );

    return { message: "OTP sent successfully" };
  }

  /**
   * Login flow. Returns access + refresh tokens and user info.
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    const { email, password, rememberMe = false } = dto;
    if (!email || !password)
      throw new BadRequestException("Email and password are required");

    const user = await this.userService.findByEmail(email);
    if (!user) throw new InvalidCredentialsException();

    const match = await this.hashService.comparePasswords(
      password,
      user.password,
    );
    if (!match) throw new InvalidCredentialsException();

    if (!user.isVerified) {
      // send OTP to verify and inform user
      await this.requestOtp({ email: user.email } as SendOtpDto);
      this.logger.warn(`Unverified account login attempt: ${user.email}`);
      throw new UnauthorizedException(
        "Account not verified. OTP sent to your email.",
      );
    }

    if (!user.isActive) throw new AccountSuspendedException();

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessTtl = rememberMe ? "15d" : this.jwtExpiresIn;
    const refreshTtl = rememberMe ? "30d" : this.jwtRefreshExpiresIn;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: accessTtl,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtRefreshSecret,
        expiresIn: refreshTtl,
      }),
    ]);

    // Update last login but don't block response on DB latency
    this.updateLastLogin(user.id).catch((err) =>
      this.logger.warn("Failed to update last login", err),
    );

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastLogin,
        role: user.role,
        email: user.email,
        phone: phone,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
      },
      tokens: { accessToken, refreshToken },
    };
  }

  /**
   * Refresh access & refresh tokens using a valid refresh token.
   */
  async refreshTokens(
    dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        dto.refreshToken,
        { secret: this.jwtRefreshSecret },
      );

      const user = await this.userService.findById(payload.sub);
      if (!user) throw new InvalidTokenException();
      if (!user.isActive) throw new UnauthorizedException("Account suspended");

      const tokens = await this.generateTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      this.logger.log(`Tokens refreshed for user: ${user.id}`);
      return tokens;
    } catch (err) {
      this.logger.warn("Refresh token invalid", (err as Error).message);
      throw new InvalidTokenException();
    }
  }

  // -------------------- Internal helpers -------------------- //

  private async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: this.jwtExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtRefreshExpiresIn,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.userService.updateUser(userId, { lastLogin: new Date() });
    } catch (err) {
      this.logger.warn("Failed to update last login", err);
    }
  }

  private generateOtp(length = 6) {
    // numeric OTP with leading zeros allowed
    const max = 10 ** length;
    const num = Math.floor(Math.random() * max)
      .toString()
      .padStart(length, "0");
    return num;
  }

  private async latestOtpForUser(userId: string): Promise<string> {
    const otpRecord = await this.prisma.otp.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return otpRecord?.otp ?? this.generateOtp();
  }

  private async storeOrUpdateOtp(
    userId: string,
    otp: string,
    expiresAt: Date,
    email: string,
    phone?: string | null,
  ) {
    const existing = await this.prisma.otp.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    const now = new Date();

    try {
      if (existing) {
        await this.prisma.otp.update({
          where: { id: existing.id },
          data: {
            otp,
            expiresAt,
            lastSentAt: now,
            resendCount: { increment: 1 },
            email,
            phone,
          },
        });
      } else {
        await this.prisma.otp.create({
          data: {
            userId,
            otp,
            expiresAt,
            lastSentAt: now,
            resendCount: 0,
            email,
            phone,
          },
        });
      }
    } catch (err) {
      this.logger.error("OtpSaveError", err);
      throw new InternalServerErrorException("Failed to generate OTP");
    }
  }

  private async dispatchOtp(
    email?: string | null,
    phone?: string | null,
    userName?: string,
    otp?: string,
  ) {
    try {
      const tasks = [] as Promise<any>[];
      if (email && userName && otp) {
        tasks.push(
          this.mailService.sendMail(email, "otp-email", {
            name: userName,
            otp,
            subject: "Your One-Time Password (OTP)",
          }),
        );
      }
      if (phone && userName && otp) {
        tasks.push(this.smsService.sendOtp(phone, userName, otp));
      }

      await Promise.all(tasks);
    } catch (err) {
      this.logger.error("OtpDispatchError", err);
      throw new InternalServerErrorException("Failed to send OTP");
    }
  }
}
