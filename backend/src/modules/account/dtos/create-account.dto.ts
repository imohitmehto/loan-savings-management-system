import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  Matches,
  IsPhoneNumber,
  IsUUID,
  ValidateNested,
  Length,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { Gender, AccountType } from "@prisma/client";

function EmptyStringToUndefined() {
  return Transform(({ value }) => (value === "" ? undefined : value));
}

// ----------------------
// Address DTOs
// ----------------------

export abstract class BaseAddressDto {
  @IsString()
  type: string;

  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsOptional()
  @IsString()
  @EmptyStringToUndefined()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  @EmptyStringToUndefined()
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

export class CurrentAddressDto extends BaseAddressDto {
  type: "CURRENT" = "CURRENT";
}

export class PermanentAddressDto extends BaseAddressDto {
  type: "PERMANENT" = "PERMANENT";
}

// ----------------------
// Nominee DTO
// ----------------------

export class NomineeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  relation: string;

  @IsOptional()
  @IsEmail()
  @EmptyStringToUndefined()
  email?: string;

  @IsOptional()
  @IsPhoneNumber("IN")
  @EmptyStringToUndefined()
  phoneNumber?: string;

  @ValidateNested()
  @Type(() => BaseAddressDto, {
    discriminator: {
      property: "type",
      subTypes: [
        { value: CurrentAddressDto, name: "CURRENT" },
        { value: PermanentAddressDto, name: "PERMANENT" },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  address: CurrentAddressDto | PermanentAddressDto;
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
  @IsString()
  occupation: string;

  @IsOptional()
  @IsString()
  @EmptyStringToUndefined()
  companyInstitute?: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber("IN")
  phone: string;

  @IsEnum(Gender)
  gender: Gender;

  // Accept date in YYYY-MM-DD format
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "dob must be in YYYY-MM-DD format",
  })
  dob: string;

  @IsEnum(AccountType)
  type: AccountType;

  // ----------- OPTIONAL FLAGS & IDS -----------

  @IsOptional()
  @IsUUID()
  @EmptyStringToUndefined()
  groupId?: string;

  @IsOptional()
  @IsUUID()
  @EmptyStringToUndefined()
  userId?: string;

  // ----------- ADDRESSES (exactly 2 items: current & permanent) -----------
  @ValidateNested({ each: true })
  @Type(() => BaseAddressDto, {
    discriminator: {
      property: "type",
      subTypes: [
        { value: CurrentAddressDto, name: "CURRENT" },
        { value: PermanentAddressDto, name: "PERMANENT" },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  addresses: Array<CurrentAddressDto | PermanentAddressDto>;

  // ----------- NOMINEES -----------
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NomineeDto)
  nominees?: NomineeDto[];

  // ----------- FILES (OPTIONAL) -----------
  @IsOptional()
  @IsString()
  @EmptyStringToUndefined()
  photo?: string;

  @IsOptional()
  @IsString()
  @EmptyStringToUndefined()
  panCard?: string;

  @IsOptional()
  @IsString()
  @EmptyStringToUndefined()
  aadhaarCard?: string;
}
