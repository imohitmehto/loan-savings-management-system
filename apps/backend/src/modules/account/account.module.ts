import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { CommonModule } from "src/common/common.module";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [CommonModule, UserModule],
})
export class AccountModule {}
