import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  HttpException,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

import { LoanService } from "./loan.service";
// import { CreateLoanDto, UpdateLoanDto } from "./dtos";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("loan")
export class LoanController {
  constructor(private readonly service: LoanService) {}

  // /**
  //  * Admin-only: Create a new loan
  //  */
  // @Post("create")
  // @Roles(Role.ADMIN)
  // @HttpCode(HttpStatus.CREATED)
  // @UseInterceptors(FileFieldsInterceptor([])) // configure files if needed
  // async create(@Req() req: any) {
  //   try {
  //     const body = { ...req.body };

  //     // Normalize boolean fields if required, for example:
  //     if (body.isActive !== undefined) {
  //       body.isActive = body.isActive === true || body.isActive === "true";
  //     }

  //     const dto = plainToClass(CreateLoanDto, body);

  //     return await this.service.createLoan();
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message || "Failed to create loan",
  //       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  /**
   * Admin-only: Get all loans
   */
  @Get("get")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.service.getAllLoans();
  }

  // /**
  //  * Admin-only: Get loan by ID
  //  */
  // @Get(":id")
  // @Roles(Role.ADMIN)
  // @HttpCode(HttpStatus.OK)
  // async getById(@Param("id") id: string) {
  //   return this.service.getLoanById(id);
  // }

  // /**
  //  * Admin-only: Update loan by ID
  //  */
  // @Patch(":id")
  // @Roles(Role.ADMIN)
  // @HttpCode(HttpStatus.OK)
  // @UseInterceptors(FileFieldsInterceptor([])) // configure field names if expecting files
  // async update(@Param("id") id: string, @Req() req: any) {
  //   try {
  //     const body = { ...req.body };

  //     if (body.isActive !== undefined) {
  //       body.isActive = body.isActive === true || body.isActive === "true";
  //     }

  //     const dto = plainToClass(UpdateLoanDto, body);

  //     return await this.service.updateLoan(id, dto);
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message || "Failed to update loan",
  //       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // /**
  //  * Admin-only: Delete a loan
  //  */
  // @Delete("delete/:id")
  // @Roles(Role.ADMIN)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async delete(@Param("id") id: string) {
  //   await this.service.deleteLoan(id);
  // }
}
