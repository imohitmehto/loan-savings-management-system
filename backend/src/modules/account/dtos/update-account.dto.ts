// src/modules/account/dtos/update-account.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateAccountDto } from "./create-account.dto";
import { IsOptional, IsUUID } from "class-validator";

/**
 * DTO for updating an account.
 * Inherits validation rules from CreateAccountDto,
 * but all properties are made optional via PartialType.
 */
export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  /**
   * The account ID to be updated (can come from route param, but allowed here in case).
   */
  @IsOptional()
  @IsUUID()
  id?: string;
}
