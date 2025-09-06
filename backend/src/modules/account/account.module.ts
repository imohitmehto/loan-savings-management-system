import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { CommonModule } from "src/common/common.module";
import { UserModule } from "../user/user.module";
import { MailService } from "src/infrastructure/mail/mail.service";
import { SmsService } from "src/infrastructure/sms/sms.service";
import { LoggerModule } from "src/infrastructure/logger/logger.module";

@Module({
  controllers: [AccountController],
  providers: [AccountService, MailService, SmsService],
  imports: [CommonModule, UserModule, LoggerModule],
})
export class AccountModule {}
