import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./infrastructure/database/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import appConfig from "./config/app.config";
import { envValidationSchema } from "./common/validations/validationSchema";
import { LoggerModule } from "./infrastructure/logger/logger.module";
import { AccountModule } from "./modules/account/account.module";
import { TransactionModule } from "./modules/transaction/transaction.module";
import { PolicyModule } from "./modules/policy/policy.module";
import { LoanModule } from "./modules/loan/loan.module";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { HealthModule } from "./modules/health/health.module";
import { SocketGateway } from "./socket/socket.gateway";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: envValidationSchema,
    }),

    PrismaModule,
    LoggerModule,
    AuthModule,
    UserModule,
    AccountModule,
    TransactionModule,
    LoanModule,
    PolicyModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    SocketGateway,
  ],
  exports: [LoggerModule],
})
export class AppModule {}
