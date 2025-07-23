import { Module } from "@nestjs/common";
import { MailService } from "src/infrastructure/mail/mail.service";
import { SmsService } from "src/infrastructure/sms/sms.service";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { Hash } from "src/common/utils/hash.util";
import { OtpService } from "./otp.service";
import { EmailTemplates } from "src/common/utils/template.util";

@Module({
  imports: [LoggerModule],
  providers: [
    SmsService,
    MailService,
    Hash,
    OtpService,
    EmailTemplates,
  ],
  exports: [OtpService],
})
export class OtpModule { }
