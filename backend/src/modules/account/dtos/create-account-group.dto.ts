import { Transform } from "class-transformer";
import { IsString, IsOptional, IsUUID, IsArray } from "class-validator";

export class CreateAccountGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  // Optional: pass account IDs to connect when creating
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  accountIds?: string[];

  // Optional: pass profit IDs to connect when creating
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  profitIds?: string[];
}
