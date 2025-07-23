import { Module } from "@nestjs/common";
import { AccountNumberUtil } from "./utils/account_number.util";
import { PrismaModule } from "../infrastructure/database/prisma.module";
import { Hash } from "./utils/hash.util";
import { OtpGenerator } from "./utils/otp_generator.util";
import { EmailTemplates } from "./utils/template.util";
import { TempPasswordUtil } from "./utils/temp_password.util";
import { format } from "path";
import { FormatPhoneNumberUtil } from "./utils/format_phone_number.util";

@Module({
  imports: [PrismaModule],
  providers: [
    AccountNumberUtil,
    Hash,
    OtpGenerator,
    EmailTemplates,
    TempPasswordUtil,
    FormatPhoneNumberUtil,
  ],
  exports: [
    AccountNumberUtil,
    Hash,
    OtpGenerator,
    EmailTemplates,
    TempPasswordUtil,
    FormatPhoneNumberUtil,
  ],
})
export class CommonModule {}
