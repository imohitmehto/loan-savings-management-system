import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/infrastructure/database/prisma.service";
import { CreateLoanPolicyDto, UpdateLoanPolicyDto } from "./dtos";

@Injectable()
export class LoanPolicyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new loan policy if one with the same name doesn't already exist.
   * @param dto - Data for creating a loan policy
   * @returns The newly created loan policy
   */
  async createLoanPolicy(dto: CreateLoanPolicyDto) {
    const exists = await this.prisma.loanPolicy.findFirst({
      where: { name: dto.name },
    });

    if (exists) {
      throw new BadRequestException(
        "Loan policy with this name already exists",
      );
    }

    try {
      return await this.prisma.loanPolicy.create({
        data: {
          name: dto.name,
          description: dto.description,
          interestRate: dto.interestRate ?? 0,
          minCreditScore: dto.minCreditScore,
          maxLoanAmount: dto.maxLoanAmount,
          rules: dto.rules,
          isActive: dto.isActive ?? true,
        },
      });
    } catch (error) {
      console.error("CreateLoanPolicyError:", error);
      throw new InternalServerErrorException("Failed to create loan policy");
    }
  }

  /**
   * Returns all active loan policies sorted by most recent.
   */
  async getAllActivePolicies() {
    return await this.prisma.loanPolicy.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Retrieves a single loan policy by ID.
   * @param id - Loan policy ID
   */
  async getPolicyById(id: string) {
    const policy = await this.prisma.loanPolicy.findUnique({ where: { id } });

    if (!policy) {
      throw new NotFoundException("Loan policy not found");
    }

    return policy;
  }

  /**
   * Updates a loan policy by ID with the given fields.
   * @param id - Loan policy ID
   * @param dto - Update fields
   */
  async updatePolicy(id: string, dto: UpdateLoanPolicyDto) {
    const policy = await this.prisma.loanPolicy.findUnique({ where: { id } });

    if (!policy) {
      throw new NotFoundException("Loan policy not found");
    }

    try {
      return await this.prisma.loanPolicy.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      console.error("UpdateLoanPolicyError:", error);
      throw new InternalServerErrorException("Failed to update loan policy");
    }
  }

  /**
   * Deletes a loan policy by ID.
   * @param id - Loan policy ID
   */
  async deletePolicy(id: string) {
    const policy = await this.prisma.loanPolicy.findUnique({ where: { id } });

    if (!policy) {
      throw new NotFoundException("Loan policy not found");
    }

    try {
      await this.prisma.loanPolicy.delete({ where: { id } });
    } catch (error) {
      console.error("DeleteLoanPolicyError:", error);
      throw new InternalServerErrorException("Failed to delete loan policy");
    }
  }
}
