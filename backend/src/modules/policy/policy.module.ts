import { Module } from "@nestjs/common";
import { LoanPolicyService } from "./policy.service";
import { LoanPolicyController } from "./policy.controller";

@Module({
  imports: [],
  controllers: [LoanPolicyController],
  providers: [LoanPolicyService],
})
export class PolicyModule {}
