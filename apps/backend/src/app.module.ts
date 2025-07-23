import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./infrastructure/database/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import appConfig from "./config/app.config";
import { validationSchema } from "./common/validations/joi/validationSchema";
import { LoggerModule } from "./infrastructure/logger/logger.module";
import { OtpModule } from "./infrastructure/otp/otp.module";
import { AccountModule } from "./modules/account/account.module";
import { TransactionModule } from "./modules/transaction/transaction.module";
import { PolicyModule } from "./modules/policy/policy.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    LoggerModule,
    OtpModule,
    AccountModule,
    TransactionModule,
    PolicyModule,
  ],
})
export class AppModule {}
