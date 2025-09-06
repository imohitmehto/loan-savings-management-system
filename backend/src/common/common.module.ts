import { Module } from "@nestjs/common";
import { AccountNumberUtil } from "./utils/account_number.util";
import { PrismaModule } from "../infrastructure/database/prisma.module";
import { Hash } from "./utils/hash.util";
import { EmailTemplates } from "./utils/template.util";
import { UserNameUtil } from "./utils/user_name.util";
import { UserModule } from "src/modules/user/user.module";

@Module({
  imports: [PrismaModule, UserModule],
  providers: [UserNameUtil, AccountNumberUtil, Hash, EmailTemplates],
  exports: [UserNameUtil, AccountNumberUtil, Hash, EmailTemplates],
})
export class CommonModule {}
