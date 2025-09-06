import { IsBoolean } from "class-validator";

export class UpdateLoanPolicyDto {
  @IsBoolean()
  isActive?: boolean;
}
