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
import { LoanPolicyService } from "./policy.service";
import { CreateLoanPolicyDto, UpdateLoanPolicyDto } from "./dtos";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { plainToClass } from "class-transformer";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("loan-policy")
export class LoanPolicyController {
  constructor(private readonly service: LoanPolicyService) {}

  /**
   * Admin-only: Create a new loan policy
   */
  @Post("create")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([]))
  async create(@Req() req: any) {
    try {
      const body = req.body;

      if (typeof body.rules === "string") {
        body.rules = JSON.parse(body.rules);
      }

      if (body.isActive !== undefined) {
        body.isActive = body.isActive === "true" || body.isActive === true;
      }

      const dto = plainToClass(CreateLoanPolicyDto, body);

      return await this.service.createLoanPolicy(dto);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to create loan policy",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Admin-only: Get all active loan policies
   */
  @Get("get")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.service.getAllPolicies();
  }

  /**
   * Admin-only: Get policy by ID
   */
  @Get("/:id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getById(@Param("id") id: string) {
    return this.service.getPolicyById(id);
  }

  /**
   * Admin-only: Update policy by ID
   */
  @Patch("/:id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileFieldsInterceptor([])) // configure field names if expecting files
  async update(@Param("id") id: string, @Req() req: any) {
    try {
      const body = { ...req.body };

      // Normalize isActive to boolean
      if (body.isActive !== undefined) {
        body.isActive =
          body.isActive === true || body.isActive === "true" ? true : false;
      }

      const dto = plainToClass(UpdateLoanPolicyDto, body);

      return this.service.updatePolicy(id, dto);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to update loan policy",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Admin-only: Delete a loan policy
   */
  @Delete("delete/:id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    await this.service.deletePolicy(id);
  }
}
