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
} from "@nestjs/common";
import { LoanPolicyService } from "./policy.service";
import { CreateLoanPolicyDto, UpdateLoanPolicyDto } from "./dtos";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { RolesGuard } from "src/common/guards/roles.guard";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("policy")
export class LoanPolicyController {
  constructor(private readonly service: LoanPolicyService) {}

  /**
   * Admin-only: Create a new loan policy
   */
  @Post("create")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateLoanPolicyDto) {
    return this.service.createLoanPolicy(dto);
  }

  /**
   * Admin-only: Get all active loan policies
   */
  @Get("get")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.service.getAllActivePolicies();
  }

  /**
   * Admin-only: Get policy by ID
   */
  @Get("get/:id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getById(@Param("id") id: string) {
    return this.service.getPolicyById(id);
  }

  /**
   * Admin-only: Update policy by ID
   */
  @Patch("update/:id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() dto: UpdateLoanPolicyDto) {
    return this.service.updatePolicy(id, dto);
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
