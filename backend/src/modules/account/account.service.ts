// src/modules/account/account.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import {
  CreateAccountDto,
  CreateAccountGroupDto,
  UpdateAccountDto,
  UpdateAccountGroupDto,
} from "./dtos";
import { AccountNumberUtil } from "../../common/utils/account_number.util";
import { Hash } from "src/common/utils/hash.util";
import { Account, AccountGroup, Role, User } from "@prisma/client";
import { generateTempPassword } from "src/common/utils/temp_password.util";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { MailService } from "src/infrastructure/mail/mail.service";
import { SmsService } from "src/infrastructure/sms/sms.service";
import { AccountAlreadyExistsException } from "./exceptions/user-exceptions";

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly accountNumberUtil: AccountNumberUtil,
    private readonly hashService: Hash,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Fetch all accounts.
   */
  async getAllAccounts(): Promise<Account[]> {
    return this.prisma.account.findMany();
  }

  /**
   * Fetch account details by ID with related data.
   * Throws NotFoundException if not found.
   */
  async getAccountById(id: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: true,
        group: true,
        transactions: true,
        addresses: true,
        nominees: true,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  /**
   * Create a new account from a DTO and optional uploaded files.
   */
  async createAccount(
    dto: CreateAccountDto,
    files?: {
      photo?: Express.Multer.File[];
      panCard?: Express.Multer.File[];
      aadhaarCard?: Express.Multer.File[];
    },
  ): Promise<{ message: string }> {
    // ): Promise<{ message: string; data: Account }> {
    try {
      // // Map uploaded file names (filenames only)
      // this.mapUploadedFiles(dto, files);

      // // Generate accessible URLs for uploaded files
      // const baseUrl = process.env.BASE_URL;
      // if (dto.photo) {
      //   dto.photo = `${baseUrl}/uploads/account/${dto.photo}`;
      // }
      // if (dto.panCard) {
      //   dto.panCard = `${baseUrl}/uploads/account/${dto.panCard}`;
      // }
      // if (dto.aadhaarCard) {
      //   dto.aadhaarCard = `${baseUrl}/uploads/account/${dto.aadhaarCard}`;
      // }

      // const user = await this.prisma.user.findUnique({
      //   where: { email: dto.email },
      // });

      // if (user) {
      //   const account = await this.prisma.account.findFirst({
      //     where: { email: dto.email },
      //   });

      //   if (account) throw new AccountAlreadyExistsException(dto.email);
      // }

      // let newUser: User | null = null;

      // let tempPassword = "";
      // if (!user) {
      //   tempPassword = generateTempPassword();
      //   const password = await this.hashService.hashPassword(tempPassword);

      //   newUser = await this.prisma.user.create({
      //     data: {
      //       firstName: dto.firstName,
      //       lastName: dto.lastName,
      //       email: dto.email,
      //       password: password,
      //       phone: dto.phone,
      //       isVerified: false,
      //       isActive: false,
      //       role: Role.CUSTOMER,
      //     },
      //   });
      // }

      // // Generate unique account number
      // const accountNumber =
      //   await this.accountNumberUtil.generateAccountNumber();

      // let accountOpeningFee = 0;

      // const account = await this.prisma.account.create({
      //   data: {
      //     accountNumber,
      //     firstName: dto.firstName,
      //     lastName: dto.lastName,
      //     fatherSpouse: dto.fatherSpouse ?? null,
      //     occupation: dto.occupation,
      //     companyInstitute: dto.companyInstitute ?? null,
      //     email: dto.email,
      //     phone: dto.phone ?? null,
      //     gender: dto.gender,
      //     dob: new Date(dto.dob),
      //     type: dto.type,
      //     group: dto.groupId ? { connect: { id: dto.groupId } } : undefined,
      //     accountOpeningFee: accountOpeningFee ?? 0,
      //     photo: dto.photo ?? null,
      //     panCard: dto.panCard ?? null,
      //     aadhaarCard: dto.aadhaarCard ?? null,

      //     user: {
      //       connect: { id: user?.id ?? newUser?.id },
      //     },

      //     addresses: {
      //       create: dto.addresses.map((addr) => ({
      //         type: addr.type,
      //         addressLine1: addr.addressLine1,
      //         addressLine2: addr.addressLine2 ?? undefined,
      //         landmark: addr.landmark ?? undefined,
      //         city: addr.city,
      //         state: addr.state,
      //         country: addr.country,
      //         pinCode: addr.pinCode,
      //       })),
      //     },

      //     nominees:
      //       dto.nominees && dto.nominees.length > 0
      //         ? {
      //           create: dto.nominees.map((nom) => ({
      //             firstName: nom.firstName,
      //             lastName: nom.lastName,
      //             relation: nom.relation,
      //             email: nom.email ?? undefined,
      //             phoneNumber: nom.phoneNumber ?? undefined,
      //             address: nom.address
      //               ? {
      //                 create: {
      //                   type: nom.address.type,
      //                   addressLine1: nom.address.addressLine1,
      //                   addressLine2: nom.address.addressLine2 ?? undefined,
      //                   landmark: nom.address.landmark ?? undefined,
      //                   city: nom.address.city,
      //                   state: nom.address.state,
      //                   country: nom.address.country,
      //                   pinCode: nom.address.pinCode,
      //                 },
      //               }
      //               : undefined,
      //           })),
      //         }
      //         : undefined,
      //   },
      //   include: {
      //     nominees: { include: { address: true } },
      //     addresses: true,
      //   },
      // });

      // if (dto.email && Role.ADMIN) {
      //   try {
      //     await this.mailService.sendMail(dto.email, "new-user-email", {
      //       name: `${dto.firstName} ${dto.lastName}`,
      //       password: tempPassword,
      //       subject: "Welcome to Our Service - Your User Account Details",
      //     });
      //   } catch (error) {
      //     console.error("Failed to send welcome email:", error);
      //   }
      // }

      // // if (!dto.role || dto.role !== Role.ADMIN) {
      // //   const notificationPayload = {
      // //     message: `New account created by user with email: ${dto.email}`,
      // //     accountId: account.id,
      // //     userEmail: dto.email,
      // //     timestamp: new Date(),
      // //   };

      // //   try {
      // //     await this.notificationService.sendNotificationToAdmin(notificationPayload);
      // //   } catch (notifyError) {
      // //     // Optionally, handle failure silently without blocking
      // //   }
      // // }

      return { message: "Account created successfully" };
      // return { message: "Account created successfully", data: account };
    } catch (error) {
      console.error("CreateAccountError:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to create account");
    }
  }

  /**
   * Update existing account with partial changes.
   */
  async updateAccount(
    id: string,
    dto: UpdateAccountDto,
    files?: {
      photo?: Express.Multer.File[];
      panCard?: Express.Multer.File[];
      aadhaarCard?: Express.Multer.File[];
    },
  ): Promise<{ message: string }> {
    // ): Promise<Account> {
    // const existing = await this.prisma.account.findUnique({ where: { id } });
    // if (!existing) {
    //   throw new NotFoundException(`Account with ID ${id} not found`);
    // }

    // // Map uploaded files to DTO
    // if (files) {
    //   this.mapUploadedFiles(dto, files);
    // }

    // // Helper function to clean update data
    // function toPrismaUpdate(input: UpdateAccountDto) {
    //   // Destructure to exclude system fields
    //   const {
    //     userId,
    //     id: dtoId,
    //     ...cleanData
    //   } = input;

    //   // Remove any remaining undefined values
    //   const filteredData = Object.fromEntries(
    //     Object.entries(cleanData).filter(([_, value]) => value !== undefined)
    //   );

    //   return filteredData;
    //   // return filteredData;
    // }

    // const updateData = toPrismaUpdate(dto);

    return await "Updated";

    // try {
    //   return await this.prisma.account.update({
    //     where: { id },
    //     data: updateData,
    //   });
  } catch(error) {
    console.error("UpdateAccountError:", error);
    throw new InternalServerErrorException("Failed to update account");
  }
}

  /**
   * Delete account by ID.
   */
  async deleteAccount(id: string): Promise < boolean > {
  const existing = await this.prisma.account.findUnique({ where: { id } });
  if(!existing) {
    return false;
  }
    await this.prisma.account.delete({ where: { id } });
  return true;
}

  async ValidateEmail(email: string): Promise < boolean > {
  const account = await this.prisma.account.findUnique({ where: { email } });

  if(!account) return false;
  else return true;
}

  /*  *************** ACCOUNT GROUP ***************  */

  /**
   * Fetch all account groups sorted by name.
   */
  async getAllAccountGroup(): Promise < AccountGroup[] > {
  return this.prisma.accountGroup.findMany({
    include: { accounts: true },
    orderBy: { name: "asc" },
  });
}

  /**
   * Get account group by ID.
   */
  async getAccountGroupById(id: string): Promise < AccountGroup > {
  const accountGroup = await this.prisma.accountGroup.findUnique({
    where: { id },
    include: { accounts: true },
  });
  if(!accountGroup) {
    throw new NotFoundException(`Account Group with ID ${id} not found`);
  }
    return accountGroup;
}

  /**
   * Create new account group with optional account/profit connections.
   */
  async createAccountGroup(dto: CreateAccountGroupDto): Promise < AccountGroup > {
  return this.prisma.accountGroup.create({
    data: {
      name: dto.name,
      description: dto.description || "",
      accounts: dto.accountIds?.length
        ? { connect: dto.accountIds.map((id) => ({ id })) }
        : undefined,
    },
    include: {
      accounts: {
        select: { accountNumber: true, firstName: true, lastName: true },
      },
    },
  });
}

  /**
   * Update account group.
   */
  async updateAccountGroup(
  id: string,
  dto: UpdateAccountGroupDto,
): Promise < AccountGroup > {
  const existing = await this.prisma.accountGroup.findUnique({
    where: { id },
  });
  if(!existing) {
    throw new NotFoundException(`Account Group with ID ${id} not found`);
  }

    return this.prisma.accountGroup.update({
    where: { id },
    data: {
      name: dto.name,
      description: dto.description ?? "",
      ...(dto.addAccountIds?.length || dto.removeAccountIds?.length
        ? {
          accounts: {
            connect:
              dto.addAccountIds?.map((accountId) => ({ id: accountId })) ??
              [],
            disconnect:
              dto.removeAccountIds?.map((accountId) => ({
                id: accountId,
              })) ?? [],
          },
        }
        : {}),
    },
    include: {
      accounts: {
        select: { accountNumber: true, firstName: true, lastName: true },
      },
    },
  });
}

  /**
   * Delete account group by ID.
   */
  async deleteAccountGroup(id: string): Promise < boolean > {
  const existing = await this.prisma.accountGroup.findUnique({
    where: { id },
  });
  if(!existing) {
    return false;
  }
    await this.prisma.accountGroup.delete({ where: { id } });
  return true;
}

  // ---------------------- PRIVATE HELPERS ----------------------

  /**
   * Map uploaded file names into the DTO.
   */
  private mapUploadedFiles(
  dto: CreateAccountDto | UpdateAccountDto,
  files ?: {
    photo?: Express.Multer.File[];
    panCard?: Express.Multer.File[];
    aadhaarCard?: Express.Multer.File[];
  },
) {
  if (files?.photo?.[0]) {
    dto.photo = files.photo[0].filename;
  }
  if (files?.panCard?.[0]) {
    dto.panCard = files.panCard[0].filename;
  }
  if (files?.aadhaarCard?.[0]) {
    dto.aadhaarCard = files.aadhaarCard[0].filename;
  }
}

  /**
   * Prepares nominee data for Prisma create.
   */
  private prepareNomineeData(dto: CreateAccountDto) {
  if (!Array.isArray(dto.nominees) || dto.nominees.length === 0)
    return undefined;
  return {
    create: dto.nominees.map((nominee) => ({
      firstName: nominee.firstName ?? "",
      lastName: nominee.lastName ?? "",
      relation: nominee.relation ?? "",
      email: nominee.email || undefined,
      phoneNumber: nominee.phoneNumber || undefined,
      address: nominee.address
        ? {
          create: {
            ...nominee.address,
            type: nominee.address.type,
          },
        }
        : undefined,
    })),
  };
}

  /**
   * Prepares address data for Prisma create.
   */
  private prepareAddressData(dto: CreateAccountDto) {
  if (!Array.isArray(dto.addresses) || dto.addresses.length === 0)
    return undefined;
  return {
    create: dto.addresses.map((address) => ({
      ...address,
      type: address.type,
    })),
  };
}
}
