import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { CreateAccountDto } from "./dtos/create-account.dto";
import { AccountNumberUtil } from "../../common/utils/account_number.util";
import { Hash } from "src/common/utils/hash.util";
import { Account } from "@prisma/client";
import { TempPasswordUtil } from "src/common/utils/temp_password.util";
import { UserService } from "../user/user.service";
import { FormatPhoneNumberUtil } from "src/common/utils/format_phone_number.util";
import { UsernameUtil } from "src/common/utils/user_name.util";

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly accountNumberUtil: AccountNumberUtil,
    private readonly hashService: Hash,
  ) {}

  async createAccount(dto: CreateAccountDto): Promise<{
    message: string;
    data: Account;
  }> {
    try {
      // Check if user exists
      if (dto.email || dto.phone) {
        const user = await this.userService.findUserByIdentifier(
          dto.email,
          dto.phone,
        );

        if (!user) {
          const userName = UsernameUtil.generate(
            dto.firstName,
            dto.lastName,
            dto.dob,
          );
          let formattedPhone = "";
          const password = TempPasswordUtil.generate();
          const hashedPassword = await this.hashService.hashPassword(password);

          if (dto.phone) {
            formattedPhone = FormatPhoneNumberUtil.formatPhoneNumber(dto.phone);
          }
          const createdUser = await this.userService.createUser({
            firstName: dto.firstName,
            lastName: dto.lastName,
            dob: new Date(dto.dob),
            email: dto.email ?? "",
            phone: formattedPhone ?? "",
            userName,
            password: hashedPassword,
          });
        }
        // dto.userId = user.id; // Set userId from found user
      }

      // Generate UserName if user is new

      const accountNumber =
        await this.accountNumberUtil.generateAccountNumber();

      if (dto.isChildAccount) {
        if (!dto.parentAccountId) {
          throw new InternalServerErrorException(
            "Parent account ID is required for child accounts",
          );
        }
      }
      const userId = await this.userService
        .findUserByIdentifier(dto.email, dto.phone)
        .then((user) => user?.id);

      const account = await this.prisma.account.create({
        data: {
          accountNumber,
          firstName: dto.firstName ?? "",
          lastName: dto.lastName ?? "",
          father_spounce: dto.father_spounce ?? "",
          occupation: dto.occupation,
          company_institute: dto.company_institute ?? "",
          email: dto.email ?? "",
          phone: dto.phone ?? "",
          gender: dto.gender,
          dob: new Date(dto.dob),
          type: dto.type,
          isChildAccount: dto.isChildAccount ?? false,
          parentAccountId: dto.parentAccountId ?? "",
          groupId: dto.groupId ?? undefined,
          accountOpeningFee: dto.accountOpeningFee ?? 0,
          photo: dto.photo ?? "",
          status: dto.status ?? "ACTIVE",
          userId: userId ?? "",

          nominees: {
            create: {
              firstName: dto.nominee.firstName ?? "",
              lastName: dto.nominee.lastName ?? "",
              relation: dto.nominee.relation ?? "",
              email: dto.nominee.email ?? "",
              phoneNumber: dto.nominee.phoneNumber ?? "",
              address: {
                create: {
                  ...(dto.nominee.address ?? {}),
                  type: dto.nominee.address.type,
                },
              },
            },
          },

          addresses: {
            create: dto.addresses.map((address) => ({
              ...address,
              type: address.type,
            })),
          },
        },
        include: {
          nominees: {
            include: {
              address: true,
            },
          },
          addresses: true,
        },
      });

      return { message: "Account created successfully", data: account };
    } catch (error) {
      console.error("CreateAccountError:", error);
      throw new InternalServerErrorException("Failed to create account");
    }
  }
}
