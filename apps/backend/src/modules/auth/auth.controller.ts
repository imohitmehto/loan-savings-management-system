// src/modules/auth/controllers/auth.controller.ts
import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { VerifyOtpDto } from "../dto/verify-otp.dto";
import { ResendOtpDto } from "../dto/resend-otp.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("verify-otp")
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post("resend-otp")
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("me")
  me(@Request() req) {
    return this.authService.me(req.user.id);
  }
}
