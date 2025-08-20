// src/modules/account/dtos/update-account-group.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateAccountGroupDto } from "./create-account-group.dto";
import { IsOptional, IsUUID, IsArray } from "class-validator";
import { Transform } from "class-transformer";

/**
 * DTO for updating an account group.
 * Inherits all create DTO validations, but makes them optional.
 * Adds fields for adding/removing accounts and profits.
 */
export class UpdateAccountGroupDto extends PartialType(CreateAccountGroupDto) {
  /**
   * Optional: IDs of accounts to add to this group.
   */
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  addAccountIds?: string[];

  /**
   * Optional: IDs of accounts to remove from this group.
   */
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  removeAccountIds?: string[];

  /**
   * Optional: IDs of profits to add.
   */
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  addProfitIds?: string[];

  /**
   * Optional: IDs of profits to remove.
   */
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  removeProfitIds?: string[];
}
