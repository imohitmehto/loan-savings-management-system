import { Module } from "@nestjs/common";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { LoanController } from "./loan.controller";
import { LoanService } from "./loan.service";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [LoggerModule, CommonModule],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
