import {
    isEmail,
    isPhoneNumber,
    isEnum,
    isNotEmpty,
    isUUID,
    IsOptional,
} from "class-validator";
import { AccountType } from "@prisma/client";


export class CreateAccountDto {
    @isNotEmpty()
    name: string;

      @IsNotEmpty()
  userId: string;

    @isNotEmpty()
    @isEmail()
    email: string;

    @isNotEmpty()
    @isPhoneNumber("IN")
    phone: string;

    @isNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    balance?: integer;

    @IsOptional()
    @isUUID()
    groupId?: string;

    @IsOptional()
    @IsUUID()
    accountNumber?: string;

    // @isNotEmpty()
    // @isEnum(AccountType)
    // accountType: AccountType;

    @IsOptional()
    address?: string;
}
