import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { PrismaService } from "src/infrastructure/database/prisma.service";

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [PrismaService],
})
export class AccountModule {}
