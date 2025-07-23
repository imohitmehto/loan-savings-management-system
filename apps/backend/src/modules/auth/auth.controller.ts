import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dtos";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user with validated credentials.
   * @returns Success message with created user info
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  /**
   * Verifies OTP for user account activation.
   * @returns Verification success message
   */
  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() body: { userName: string; otp: string }) {
    const { userName, otp } = body;
    if (!userName || !otp) {
      throw new Error("Missing required fields: userName and otp");
    }
    return await this.authService.verify(userName, otp);
  }

  /**
   * Resends OTP to the user if needed.
   * @returns Resend confirmation
   */
  @Post("resend-otp")
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() body: { userName: string }) {
    const { userName } = body;
    if (!userName) {
      throw new Error("Missing required field: userName");
    }
    return await this.authService.resendOtp({ userName });
  }

  /**
   * Authenticates user and returns access & refresh tokens.
   * @returns Auth response with tokens and user info
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  /**
   * Returns current logged-in user's profile.
   * Protected route with JWT.
   */
  @UseGuards(JwtAuthGuard)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  async me(@Request() req) {
    const userId = req?.user?.userId;
    if (!userId) {
      throw new Error("Invalid user context");
    }
    return await this.authService.me(userId);
  }
}