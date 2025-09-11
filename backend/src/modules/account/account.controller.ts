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
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { accountMulterConfig } from "../../config/multer.config";
import { plainToClass } from "class-transformer";
import { Role } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { parseFormDataBody } from "src/common/utils/parseFormDataBody";
import { HTTP_CODE_METADATA } from "@nestjs/common/constants";
import { get } from "http";

@Controller("account")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * Get all accounts (ADMIN only)
   */
  @Get("get")
  @Roles(Role.ADMIN)
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
  // @Post("create")
  // @Roles(Role.ADMIN)
  // @HttpCode(HttpStatus.CREATED)
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       { name: "photo", maxCount: 1 },
  //       { name: "panCard", maxCount: 1 },
  //       { name: "aadhaarCard", maxCount: 1 },
  //     ],
  //     accountMulterConfig,
  //   ),
  // )
  // async create(
  //   @Req() req: any,
  //   @UploadedFiles()
  //   files: {
  //     photo?: Express.Multer.File[];
  //     panCard?: Express.Multer.File[];
  //     aadhaarCard?: Express.Multer.File[];
  //   },
  // ) {
  //   try {
  //     // Raw FormData body
  //     const body = req.body;

  //     // console.log("Raw body:", body);

  //     // Parse flat FormData into nested objects
  //     const parsedBody = parseFormDataBody(body);
  //     console.log("Parsing addresses:", parsedBody);

  //     // JSON.parse stringified arrays if needed
  //     if (typeof parsedBody.addresses === "string") {
  //       parsedBody.addresses = JSON.parse(parsedBody.addresses);
  //     }
  //     if (typeof parsedBody.nominees === "string") {
  //       parsedBody.nominees = JSON.parse(parsedBody.nominees);
  //     }

  //     if (Array.isArray(parsedBody.nominees)) {
  //       parsedBody.nominees = parsedBody.nominees.map((nominee) => {
  //         if (typeof nominee.address === "string") {
  //           try {
  //             nominee.address = JSON.parse(nominee.address);
  //           } catch {
  //             // keep as string if not valid JSON
  //           }
  //         }
  //         return nominee;
  //       });
  //     }
  //     console.log("Parsed body:", parsedBody);

  //     // Convert isChildAccount to boolean
  //     if (parsedBody.isChildAccount !== undefined) {
  //       parsedBody.isChildAccount =
  //         parsedBody.isChildAccount === "true" ||
  //         parsedBody.isChildAccount === true;
  //     }

  //     // Attach uploaded filenames
  //     if (files.photo?.[0]) {
  //       parsedBody.photo = files.photo[0].filename;
  //     }
  //     if (files.panCard?.[0]) {
  //       parsedBody.panCard = files.panCard[0].filename;
  //     }
  //     if (files.aadhaarCard?.[0]) {
  //       parsedBody.aadhaarCard = files.aadhaarCard[0].filename;
  //     }

  //     // Transform into DTO (validates format dd-mm-yyyy for dob,
  //     // exactly two addresses: CURRENT & PERMANENT, optional nominees array)
  //     const dto = plainToClass(CreateAccountDto, parsedBody);

  //     // Pass to service
  //     return await this.accountService.createAccount(dto, files);
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message || "Failed to create account",
  //       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  /**
   * Update account with file uploads (ADMIN only)
   */
  // @Patch(":id")
  //   @Roles(Role.ADMIN)
  // @HttpCode(HttpStatus.OK)
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       { name: "photo", maxCount: 1 },
  //       { name: "panCard", maxCount: 1 },
  //       { name: "aadhaarCard", maxCount: 1 },
  //     ],
  //     accountMulterConfig,
  //   ),
  // )
  // async updateAccount(
  //   @Param("id") id: string,
  //   @Body() dto: UpdateAccountDto,
  //   @UploadedFiles()
  //   files: {
  //     photo?: Express.Multer.File[];
  //     panCard?: Express.Multer.File[];
  //     aadhaarCard?: Express.Multer.File[];
  //   },
  // ) {
  //   try {
  //     // Map new file uploads to DTO
  //     if (files?.photo?.[0]) dto.photo = files.photo[0].filename;
  //     if (files?.panCard?.[0]) dto.panCard = files.panCard[0].filename;
  //     if (files?.aadhaarCard?.[0])
  //       dto.aadhaarCard = files.aadhaarCard[0].filename;

  //     const updatedAccount = await this.accountService.updateAccount(id, dto);

  //     if (!updatedAccount) {
  //       throw new NotFoundException(`Account with ID ${id} not found`);
  //     }

  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: "Account updated successfully",
  //       data: updatedAccount,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message || "Failed to update account",
  //       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  /**
   * DELETE Account by ID (ADMIN only)
   */
  @Delete(":id")
  @Roles(Role.ADMIN)
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

  // @Get("/validate/:email")
  // @Roles(Role.ADMIN)
  // @HttpCode(HttpStatus.OK)
  // async ValidateEmail(@Param("email") email: string) {
  //   return await this.accountService.ValidateEmail(email);
  // }

  // ------------------ ACCOUNT GROUP ENDPOINTS ------------------

  /**
   * Get all account groups (ADMIN only)
   */
  @Get("group/get")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  getAllGroup() {
    return this.accountService.getAllAccountGroup();
  }

  /**
   * Get account group by ID (ADMIN only)
   */
  @Get("group/:id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  getGroupById(@Param("id") id: string) {
    return this.accountService.getAccountGroupById(id);
  }

  /**
   * Create a new account group (ADMIN only)
   */
  @Post("group/create")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  createAccountGroup(@Body() dto: CreateAccountGroupDto) {
    return this.accountService.createAccountGroup(dto);
  }

  /**
   * Update an account group (ADMIN only)
   */
  @Patch("group/:id")
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
