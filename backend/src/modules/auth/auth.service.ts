import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { RegisterDto, LoginDto } from "./dtos";
import { Hash } from "src/common/utils/hash.util";
import { OtpService } from "src/infrastructure/otp/otp.service";
import { LoggerService } from "../../infrastructure/logger/logger.service";
import { ConfigService } from "@nestjs/config";
import { FormatPhoneNumberUtil } from "src/common/utils/format_phone_number.util";
import { UsernameUtil } from "src/common/utils/user_name.util";

@Injectable()
export class AuthService {
  private expiresIn: string;
  private refreshSecret: string;
  private refreshExpiresIn: string;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private hashService: Hash,
    private otpService: OtpService,
    private logger: LoggerService,
    private readonly config: ConfigService,
  ) {
    const jwt = this.config.get("jwt");
    this.expiresIn = jwt.expiresIn;
    this.refreshSecret = jwt.refreshSecret;
    this.refreshExpiresIn = jwt.refreshExpiresIn;
  }

  async register(
    dto: RegisterDto,
  ): Promise<{ message: string; userName: string }> {
    const { firstName, lastName, dob, email, phone, password } = dto;

    // Check if user already exists by email or phone
    const existingUser = await this.userService.findUserByIdentifier(
      email,
      phone,
    );
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    // Generate a unique username & hash the password
    const userName = UsernameUtil.generate(firstName, lastName, dob);
    const hashedPassword = await this.hashService.hashPassword(password);

    // Format the phone number if provided
    const formattedPhone = phone
      ? FormatPhoneNumberUtil.formatPhoneNumber(phone)
      : "";

    // Create the user entry
    const createdUser = await this.userService.createUser({
      firstName,
      lastName,
      dob: new Date(dob),
      email,
      phone: formattedPhone,
      userName,
      password: hashedPassword,
    });

    // Send OTP (email and/or phone)
    try {
      await this.otpService.sendOtp(createdUser.id, email, formattedPhone);
      this.logOtpSent(email, formattedPhone);
    } catch (err) {
      this.logger.error(
        `Failed to send OTP to ${email || formattedPhone}`,
        err,
      );
      throw new InternalServerErrorException(
        "Failed to send OTP. Please try again later.",
      );
    }

    return { message: "OTP sent successfully", userName };
  }

  private logOtpSent(email?: string, phone?: string): void {
    if (email && phone) {
      this.logger.log(`OTP sent to ${email} and ${phone}`);
    } else if (email) {
      this.logger.log(`OTP sent to ${email}`);
    } else if (phone) {
      this.logger.log(`OTP sent to ${phone}`);
    }
  }

  /**
   * Verifies user's account via OTP and marks them as verified.
   * @param userName - Unique username to identify user.
   * @param otp - OTP provided by user for verification.
   * @returns Success message if OTP is valid.
   */
  async verify(userName: string, otp: string): Promise<{ message: string }> {
    // Step 1: Lookup user by username
    const user = await this.userService.findByUserName(userName);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const userId = user.id;

    // Step 2: Validate OTP for that user
    const isOtpValid = await this.otpService.verifyOtp(userId, otp);
    if (!isOtpValid) {
      throw new BadRequestException("Invalid or expired OTP");
    }

    // Step 3: Mark user as verified
    await this.userService.updateUser(userId, { isVerified: true });

    // Step 4: Return success message
    return { message: "Account verified successfully" };
  }

  /**
   * Resends OTP to the user via email or phone.
   * @param data - Object containing the user's username.
   * @returns Message confirming OTP delivery.
   */
  async resendOtp(data: { userName: string }): Promise<{ message: string }> {
    // Step 1: Fetch user by username
    const user = await this.userService.findByUserName(data.userName);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { id: userId, email, phone } = user;

    // Step 2: Send OTP via preferred method
    await this.otpService.sendOtp(userId, email, phone);

    // Step 3: Confirm resend
    return { message: "OTP resent successfully" };
  }

  /**
   * Handles user login by validating credentials and issuing tokens.
   * If user is not verified, it triggers OTP resend and blocks login.
   */
  async login(dto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; userName: string };
  }> {
    const { userName, password, rememberMe = false } = dto;

    // Step 1: Find user
    const user = await this.userService.findByUserName(userName);

    // Step 2: Validate credentials
    const credentialsAreInvalid =
      !user ||
      !(await this.hashService.comparePasswords(password, user.password));
    if (credentialsAreInvalid) {
      throw new UnauthorizedException("Invalid login credentials provided.");
    }

    // Step 3: Check verification
    if (!user.isVerified) {
      await this.resendOtp({ userName });
      throw new UnauthorizedException(
        "Account not verified. Please verify the OTP sent to your email/phone before logging in.",
      );
    }

    const name = user.firstName + " " + user.lastName;

    // Step 4: Build token payload
    const payload = {
      sub: user.id,
      name: name,
      userName: user.userName,
      role: user.role,
    };

    // Step 5: Compute dynamic expiry
    const accessTokenExpiry = rememberMe ? "30d" : this.expiresIn;
    const refreshTokenExpiry = rememberMe ? "60d" : this.refreshExpiresIn;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiry,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiry,
      secret: this.refreshSecret,
    });

    // Step 6: Return enriched response
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        userName: user.userName,
      },
    };
  }

  /**
   * Returns profile info of currently authenticated user.
   * Includes only non-sensitive public fields.
   */
  async me(userId: string): Promise<{
    id: string;
    userName: string;
    isVerified: boolean;
    createdAt: Date;
  }> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      userName: user.userName,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}
