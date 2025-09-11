import { Module } from "@nestjs/common";
import { AccountNumberUtil } from "./utils/account_number.util";
import { PrismaModule } from "../infrastructure/database/prisma.module";
import { Hash } from "./utils/hash.util";
import { Templates } from "./utils/template.util";
import { UserModule } from "src/modules/user/user.module";

@Module({
  imports: [PrismaModule, UserModule],
  providers: [AccountNumberUtil, Hash, Templates],
  exports: [AccountNumberUtil, Hash, Templates],
})
export class CommonModule {}
