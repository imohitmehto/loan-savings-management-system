// // src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { RegisterDto, LoginDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async register(dto: RegisterDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (user) throw new BadRequestException("User already exists");

    const hashed = await bcrypt.hash(dto.password, 10);
    const newUser = await this.userService.createUser({
      ...dto,
      password: hashed,
    });

    await this.otpService.sendOtp(newUser.email);
    return { message: "OTP sent to email" };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const valid = await this.otpService.verifyOtp(dto.emailOrPhone, dto.otp);
    if (!valid) throw new BadRequestException("Invalid or expired OTP");

    await this.userService.verifyUser(dto.emailOrPhone);
    return { message: "Account verified successfully" };
  }

  async resendOtp(dto: ResendOtpDto) {
    const user = await this.userService.findByEmailOrPhone(dto.emailOrPhone);
    if (!user) throw new NotFoundException("User not found");

    await this.otpService.sendOtp(user);
    return { message: "OTP resent successfully" };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.isVerified)
      throw new UnauthorizedException("User not found or not verified");

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid credentials'");

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async validateOtp(dto: ValidateOtpDto) {
    const valid = await this.otpService.verifyOtp(dto.email, dto.otp);
    if (!valid) throw new UnauthorizedException("Invalid OTP");
    await this.userService.activateUser(dto.email);
    return { message: "User verified successfully" };
  }

  async register(dto: RegisterDto) {

    const hash = await bcrypt.hash(dto.password, 10);
    const otpCode = generateOtp(); // e.g., 6-digit code
    const otpExpiresAt = dayjs().add(10, 'minutes').toDate();

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hash,
        otpCode,
        otpExpiresAt,
      },
    });

    if (dto.email) await this.mailService.sendOtp(dto.email, otpCode);
    if (dto.phone) await this.smsService.sendOtp(dto.phone, otpCode);

    return { message: 'OTP sent. Please verify your account.' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { phone: dto.phone },
        ],
      },
    });

    if (!user || user.otpCode !== dto.otpCode || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    return { message: 'Account verified successfully.' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.emailOrPhone },
          { phone: dto.emailOrPhone },
        ],
      },
    });

    if (!user || !user.isVerified) throw new UnauthorizedException('User not verified');
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { accessToken: token };
  }

}