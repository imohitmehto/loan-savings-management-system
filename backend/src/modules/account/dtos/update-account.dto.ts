import { PartialType } from "@nestjs/mapped-types";
import { CreateAccountDto } from "./create-account.dto";
import { IsOptional, IsUUID } from "class-validator";

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsOptional()
  @IsUUID()
  id?: string;
}
