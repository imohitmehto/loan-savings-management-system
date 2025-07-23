// src/modules/auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  HttpCode,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dtos";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("verify-otp")
  verifyOtp(@Body() body: { userName: string; otp: string }) {
    return this.authService.verify(body.userName, body.otp);
  }

  @Post("resend-otp")
  resendOtp(@Body() body: { userName: string }) {
    return this.authService.resendOtp({ userName: body.userName });
  }

  @Post("login")
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Request() req) {
    return this.authService.me(req.user.userId);
  }
}
