import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";

import { UserModule } from "../user/user.module";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { CommonModule } from "src/common/common.module";
import { OtpModule } from "../../infrastructure/otp/otp.module";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("app.jwt.secret"),
        signOptions: {
          expiresIn: config.get<string>("app.jwt.expiresIn"),
        },
      }),
    }),
    UserModule,
    LoggerModule,
    CommonModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
