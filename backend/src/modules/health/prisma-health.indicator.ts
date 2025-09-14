import { Injectable } from "@nestjs/common";
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from "@nestjs/terminus";
import { PrismaService } from "src/infrastructure/database/prisma.service";

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      // Simple query to test database connectivity
      await this.prismaService.$queryRaw`SELECT 1`;

      // Optional: Test a simple query on one of your tables
      const userCount = await this.prismaService.user.count();

      return this.getStatus(key, true, {
        database: "connected",
        userCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Database connection failed";
      throw new HealthCheckError(
        `${key} check failed`,
        this.getStatus(key, false, { error: errorMessage }),
      );
    }
  }

  async detailedCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      const startTime = Date.now();

      // Test database connection with a more comprehensive check
      await this.prismaService.$queryRaw`SELECT version()`;

      const responseTime = Date.now() - startTime;

      // Get database stats
      const stats = await this.prismaService.$queryRaw`
        SELECT 
          datname as database_name,
          numbackends as active_connections,
          xact_commit as transactions_committed,
          xact_rollback as transactions_rollback
        FROM pg_stat_database 
        WHERE datname = current_database()
      `;

      return this.getStatus(key, true, {
        database: "connected",
        responseTime: `${responseTime}ms`,
        stats: stats || {},
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Database detailed check failed";
      throw new HealthCheckError(
        `${key} detailed check failed`,
        this.getStatus(key, false, { error: errorMessage }),
      );
    }
  }
}
