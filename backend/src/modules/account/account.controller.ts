// src/modules/account/account.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Req,
  HttpException,
  NotFoundException,
  Delete,
} from "@nestjs/common";
import { AccountService } from "./account.service";
import {
  CreateAccountDto,
  UpdateAccountDto,
  CreateAccountGroupDto,
  UpdateAccountGroupDto,
} from "./dtos";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { accountMulterConfig } from "../../config/multer.config";

@Controller("account")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * Get all accounts (ADMIN only)
   */
  @Get("get")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.accountService.getAllAccounts();
  }

  /**
   * Get account by ID
   */
  @Get(":id")
  getById(@Param("id") id: string) {
    return this.accountService.getAccountById(id);
  }

  /**
   * Create new account with file uploads (ADMIN only)
   */
  @Post("create")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.CREATED)
  // @FormDataRequest()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "photo", maxCount: 1 },
        { name: "panCard", maxCount: 1 },
        { name: "aadhaarCard", maxCount: 1 },
      ],
      accountMulterConfig,
    ),
  )
  async create(
    @Req() req: any,
    @Body() dto: CreateAccountDto,
    @UploadedFiles()
    files: {
      photo?: Express.Multer.File[];
      panCard?: Express.Multer.File[];
      aadhaarCard?: Express.Multer.File[];
    },
  ) {
    try {
      if (files?.photo?.[0]) dto.photo = files.photo[0].filename;
      if (files?.panCard?.[0]) dto.panCard = files.panCard[0].filename;
      if (files?.aadhaarCard?.[0])
        dto.aadhaarCard = files.aadhaarCard[0].filename;

      return await this.accountService.createAccount(dto);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to create account",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update account with file uploads (ADMIN only)
   */
  @Patch(":id")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "photo", maxCount: 1 },
        { name: "panCard", maxCount: 1 },
        { name: "aadhaarCard", maxCount: 1 },
      ],
      accountMulterConfig,
    ),
  )
  async updateAccount(
    @Param("id") id: string,
    @Body() dto: UpdateAccountDto,
    @UploadedFiles()
    files: {
      photo?: Express.Multer.File[];
      panCard?: Express.Multer.File[];
      aadhaarCard?: Express.Multer.File[];
    },
  ) {
    try {
      // Map new file uploads to DTO
      if (files?.photo?.[0]) dto.photo = files.photo[0].filename;
      if (files?.panCard?.[0]) dto.panCard = files.panCard[0].filename;
      if (files?.aadhaarCard?.[0])
        dto.aadhaarCard = files.aadhaarCard[0].filename;

      const updatedAccount = await this.accountService.updateAccount(id, dto);

      if (!updatedAccount) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }

      return {
        statusCode: HttpStatus.OK,
        message: "Account updated successfully",
        data: updatedAccount,
      };
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to update account",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * DELETE Account by ID (ADMIN only)
   */
  @Delete(":id")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Param("id") id: string) {
    const result = await this.accountService.deleteAccount(id);
    if (!result) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: "Account deleted successfully",
    };
  }

  // ------------------ ACCOUNT GROUP ENDPOINTS ------------------

  /**
   * Get all account groups (ADMIN only)
   */
  @Get("group/get")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  getAllGroup() {
    return this.accountService.getAllAccountGroup();
  }

  /**
   * Get account group by ID (ADMIN only)
   */
  @Get("group/:id")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  getGroupById(@Param("id") id: string) {
    return this.accountService.getAccountGroupById(id);
  }

  /**
   * Create a new account group (ADMIN only)
   */
  @Post("group/create")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  // @FormDataRequest()
  createAccountGroup(@Body() dto: CreateAccountGroupDto) {
    return this.accountService.createAccountGroup(dto);
  }

  /**
   * Update an account group (ADMIN only)
   */
  @Patch("group/:id")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  updateAccountGroup(
    @Param("id") id: string,
    @Body() dto: UpdateAccountGroupDto,
  ) {
    return this.accountService.updateAccountGroup(id, dto);
  }

  /**
   * DELETE Account Group by ID (ADMIN only)
   */
  @Delete("group/:id")
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  async deleteAccountGroup(@Param("id") id: string) {
    const result = await this.accountService.deleteAccountGroup(id);
    if (!result) {
      throw new NotFoundException(`Account group with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: "Account group deleted successfully",
    };
  }
}
