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
} from "class-validator";
import {
  AccountType,
  Gender,
  OccupationType,
  AddressType,
} from "@prisma/client";

// ----------------------
// Address DTOs
// ----------------------
export class AddressDto {
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
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @Length(6, 6)
  pinCode: string;
}

export class NomineeAddressDto extends AddressDto {
  @IsEnum(AddressType)
  type: AddressType = AddressType.NOMINEE;
}

// ----------------------
// Nominee DTO
// ----------------------
export class NomineeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  relation: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsPhoneNumber("IN")
  phoneNumber?: string;

  @ValidateNested()
  address: NomineeAddressDto;
}

// ----------------------
// CreateAccount DTO
// ----------------------
export class CreateAccountDto {
  // ----------- BASIC INFO -----------
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  fatherSpouse: string;

  // ----------- ENUMS -----------
  @IsEnum(OccupationType)
  occupation: OccupationType;

  @IsOptional()
  @IsString()
  companyInstitute?: string;

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

  // ----------- OPTIONAL FLAGS & IDs -----------
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
  status?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  // ----------- ADDRESSES -----------
  @ValidateNested({ each: true })
  addresses: AddressDto[];


  // ----------- NOMINEES -----------
  @IsOptional()
  @ValidateNested({ each: true })
  nominees?: NomineeDto[];

  // ----------- FILES (OPTIONAL) -----------
  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  panCard?: string;

  @IsOptional()
  @IsString()
  aadhaarCard?: string;
}
