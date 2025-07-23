import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsPhoneNumber,
  IsNumber,
  IsUUID,
  ValidateNested,
  Length,
  isEnum,
} from "class-validator";
import { Type } from "class-transformer";
import {
  AccountType,
  Gender,
  OccupationType,
  AddressType,
  AccountStatus,
} from "@prisma/client";

class AddressDto {
  @IsEnum(AddressType)
  type: AddressType;

  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  @Length(6, 6)
  pinCode: string;
}

class NomineeAddressDto extends AddressDto {
  @IsEnum(AddressType)
  type: AddressType = AddressType.NOMINEE;
}

class NomineeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  relation: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber("IN")
  phoneNumber?: string;

  @ValidateNested()
  @Type(() => NomineeAddressDto)
  address: NomineeAddressDto;
}

export class CreateAccountDto {
  // ✅ Basic Info
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  father_spounce: string;

  @IsEnum(OccupationType)
  occupation: OccupationType;

  @IsOptional()
  @IsString()
  company_institute: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString()
  dob: string;

  @IsEnum(AccountType)
  type: AccountType;

  // ✅ System-generated / optional fields
  @IsOptional()
  @IsBoolean()
  isChildAccount?: boolean;

  @IsOptional()
  @IsUUID()
  parentAccountId?: string;

  @IsOptional()
  @IsUUID()
  groupId?: string;

  @IsOptional()
  @IsNumber()
  accountOpeningFee?: number;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  status: string;

  @IsOptional()
  userId: string;

  // ✅ Address (current + permanent)
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];

  // ✅ Nominee
  @ValidateNested()
  @Type(() => NomineeDto)
  nominee: NomineeDto;
}
