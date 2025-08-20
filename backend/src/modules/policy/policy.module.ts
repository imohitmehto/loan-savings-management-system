import { Module } from "@nestjs/common";
import { LoanPolicyService } from "./policy.service";
import { LoanPolicyController } from "./policy.controller";
import { LoggerModule } from "src/infrastructure/logger/logger.module";

@Module({
  imports: [LoggerModule],
  controllers: [LoanPolicyController],
  providers: [LoanPolicyService],
})
export class PolicyModule {}
