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
import { OtpService } from "src/modules/otp/otp.service";
import { LoggerService } from "../../infrastructure/logger/logger.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private hashService: Hash,
    private otpService: OtpService,
    private logger: LoggerService,
  ) { }

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const { name, email, phone, password } = dto;

    // Check for existing user
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    // Hash the password securely
    const hashedPassword = await this.hashService.hashPassword(password);

    // Format phone number with +91 if not already present
    const formattedPhone = this.formatPhoneNumber(phone);

    // Create user
    const createdUser = await this.userService.createUser({
      name,
      email,
      phone: formattedPhone,
      password: hashedPassword,
    });

    // Send OTP (email & phone)
    try {
      await this.otpService.sendOtp(createdUser.id, email, formattedPhone);
      this.logger.log(`OTP sent to ${email} and ${formattedPhone}`);
    } catch (err) {
      this.logger.error(`Failed to send OTP to ${email}`, err);
      throw new InternalServerErrorException(
        "Failed to send OTP. Please try again later.",
      );
    }

    return { message: "OTP sent successfully" };
  }

  async verify(email: string, otp: string): Promise<{ message: string }> {
    const success = await this.otpService.verifyOtp(email, otp);
    if (!success) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.userService.findByEmail(email);
    const userId = user!.id;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userService.updateUser(userId, { isVerified: true });

    return { message: 'Account verified successfully' };
  }

  async resendOtp(data: { id: string }): Promise<{ message: string }> {
    const user = await this.userService.findById(data.id);
    if (!user) throw new NotFoundException("User not found");

    await this.otpService.sendOtp(user.id, user.email, user.phone);
    return { message: "OTP resent successfully" };
  }


  async login(dto: LoginDto): Promise<{
    accessToken: string;
    user: { id: string; name: string; email: string }
  }> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !(await this.hashService.comparePasswords(dto.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified) throw new UnauthorizedException('Email not verified');

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, "");

    // If already starts with +91, return as is
    if (digits.startsWith("91") && digits.length === 12) {
      return `+${digits}`;
    }

    // If 10 digits, assume Indian local number and add +91
    if (digits.length === 10) {
      return `+91${digits}`;
    }

    // If format is unexpected, throw error
    throw new BadRequestException("Invalid phone number format");
  }

  async me(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return only safe user data
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}
