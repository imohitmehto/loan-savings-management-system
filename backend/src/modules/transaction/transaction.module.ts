import { Module } from "@nestjs/common";
// import { TransactionService } from "./transaction.service";
// import { TransactionController } from "./transaction.controller";
import { CommonModule } from "src/common/common.module";
import { UserModule } from "../user/user.module";

@Module({
  // controllers: [TransactionController],
  // providers: [TransactionService],
  imports: [CommonModule, UserModule],
})
export class TransactionModule {}
