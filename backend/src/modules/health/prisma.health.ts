// src/health/prisma.health.ts
import { Injectable } from "@nestjs/common";
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from "@nestjs/terminus";
import { PrismaService } from "src/infrastructure/database/prisma.service";

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Simple database ping using raw query
      await this.prismaService.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError("Prisma check failed", error);
    }
  }

  // Alternative method using $connect
  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$connect();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError("Prisma connection failed", error);
    }
  }
}
