// src/modules/account/account.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
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
import { Account, AccountGroup } from "@prisma/client";
import { TempPasswordUtil } from "src/common/utils/temp_password.util";
import { UserService } from "../user/user.service";
import { FormatPhoneNumberUtil } from "src/common/utils/format_phone_number.util";
import { UsernameUtil } from "src/common/utils/user_name.util";
import { toPrismaUpdate } from "src/common/utils/object.util";

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly accountNumberUtil: AccountNumberUtil,
    private readonly hashService: Hash,
  ) {}

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
        profitShares: true,
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
  ): Promise<{ message: string; data: Account }> {
    try {
      // Map uploaded file names
      this.mapUploadedFiles(dto, files);

      // Ensure user exists or create new one
      const userId = await this.ensureUserExists(dto);

      // Generate unique account number
      const accountNumber =
        await this.accountNumberUtil.generateAccountNumber();

      // Validate parent account requirement
      if (dto.isChildAccount && !dto.parentAccountId) {
        throw new BadRequestException(
          "Parent account ID is required for child accounts",
        );
      }

      // Process nominees + addresses
      const nomineeData = this.prepareNomineeData(dto);
      const addressData = this.prepareAddressData(dto);

      // Create account
      const account = await this.prisma.account.create({
        data: {
          accountNumber,
          firstName: dto.firstName ?? "",
          lastName: dto.lastName ?? "",
          fatherSpouse: dto.fatherSpouse ?? "",
          occupation: dto.occupation,
          companyInstitute: dto.companyInstitute ?? "",
          email: dto.email ?? "",
          phone: dto.phone ?? "",
          gender: dto.gender,
          dob: new Date(dto.dob),
          type: dto.type,
          isChildAccount: dto.isChildAccount ?? false,
          parentAccountId: dto.parentAccountId || undefined,
          groupId: dto.groupId || undefined,
          accountOpeningFee: dto.accountOpeningFee ?? 0,
          photo: dto.photo ?? "",
          panCard: dto.panCard ?? "",
          aadhaarCard: dto.aadhaarCard ?? "",
          // status: dto.status ?? "ACTIVE",
          userId: userId ?? "",
          nominees: nomineeData,
          addresses: addressData,
        },
        include: {
          nominees: { include: { address: true } },
          addresses: true,
        },
      });

      return { message: "Account created successfully", data: account };
    } catch (error) {
      console.error("CreateAccountError:", error);
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
  ): Promise<Account> {
    const existing = await this.prisma.account.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    this.mapUploadedFiles(dto, files);

    // Convert dob string to Date if present
    if (dto.dob) {
      dto.dob = new Date(dto.dob) as any;
    }

    // Remove undefined fields and specifically userId if undefined
    const updateData = toPrismaUpdate(dto);

    try {
      return await this.prisma.account.update({
        where: { id },
        data: updateData, // Now safe for Prisma
      });
    } catch (error) {
      console.error("UpdateAccountError:", error);
      throw new InternalServerErrorException("Failed to update account");
    }
  }

  /**
   * Delete account by ID.
   */
  async deleteAccount(id: string): Promise<boolean> {
    const existing = await this.prisma.account.findUnique({ where: { id } });
    if (!existing) {
      return false;
    }
    await this.prisma.account.delete({ where: { id } });
    return true;
  }

  /**
   * Fetch all account groups sorted by name.
   */
  async getAllAccountGroup(): Promise<AccountGroup[]> {
    return this.prisma.accountGroup.findMany({
      include: { accounts: true, profits: true },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get account group by ID.
   */
  async getAccountGroupById(id: string): Promise<AccountGroup> {
    const accountGroup = await this.prisma.accountGroup.findUnique({
      where: { id },
      include: { accounts: true, profits: true },
    });
    if (!accountGroup) {
      throw new NotFoundException(`Account Group with ID ${id} not found`);
    }
    return accountGroup;
  }

  /**
   * Create new account group with optional account/profit connections.
   */
  async createAccountGroup(dto: CreateAccountGroupDto): Promise<AccountGroup> {
    return this.prisma.accountGroup.create({
      data: {
        name: dto.name,
        description: dto.description || "",
        accounts: dto.accountIds?.length
          ? { connect: dto.accountIds.map((id) => ({ id })) }
          : undefined,
        profits: dto.profitIds?.length
          ? { connect: dto.profitIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        accounts: {
          select: { accountNumber: true, firstName: true, lastName: true },
        },
        profits: true,
      },
    });
  }

  /**
   * Update account group.
   */
  async updateAccountGroup(
    id: string,
    dto: UpdateAccountGroupDto,
  ): Promise<AccountGroup> {
    const existing = await this.prisma.accountGroup.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Account Group with ID ${id} not found`);
    }

    return this.prisma.accountGroup.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        description: dto.description ?? undefined,
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
        profits: true,
      },
    });
  }

  /**
   * Delete account group by ID.
   */
  async deleteAccountGroup(id: string): Promise<boolean> {
    const existing = await this.prisma.accountGroup.findUnique({
      where: { id },
    });
    if (!existing) {
      return false;
    }
    await this.prisma.accountGroup.delete({ where: { id } });
    return true;
  }

  // ---------------------- PRIVATE HELPERS ----------------------

  /**
   * Map uploaded file names into the DTO.
   */
  private mapUploadedFiles(dto: any, files?: any) {
    dto.photo = files?.photo || dto.photo || "";
    dto.panCard = files?.panCard || dto.panCard || "";
    dto.aadhaarCard = files?.aadhaarCard || dto.aadhaarCard || "";
  }

  /**
   * Creates a user if one doesn't exist for provided email/phone.
   */
  private async ensureUserExists(
    dto: CreateAccountDto,
  ): Promise<string | undefined> {
    if (!dto.email && !dto.phone) return undefined;

    const existingUser = await this.userService.findUserByIdentifier(
      dto.email,
      dto.phone,
    );

    if (existingUser) return existingUser.id;

    const userName = UsernameUtil.generate(
      dto.firstName,
      dto.lastName,
      dto.dob,
    );
    const formattedPhone = dto.phone
      ? FormatPhoneNumberUtil.formatPhoneNumber(dto.phone)
      : "";
    const password = TempPasswordUtil.generate();
    const hashedPassword = await this.hashService.hashPassword(password);

    const createdUser = await this.userService.createUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      dob: new Date(dto.dob),
      email: dto.email ?? "",
      phone: formattedPhone,
      userName,
      password: hashedPassword,
    });

    return createdUser.id;
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
