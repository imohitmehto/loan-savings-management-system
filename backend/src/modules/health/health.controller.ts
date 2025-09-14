import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from "@nestjs/terminus";
import { PrismaHealthIndicator } from "./prisma-health.indicator";
import { Public } from "../auth/decorators/public.decorator";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private db: PrismaHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    return this.health.check([
      // Basic HTTP ping check
      () => this.http.pingCheck("nestjs", "http://localhost:3000"),

      // Database connectivity check
      () => this.db.pingCheck("database"),

      // Memory usage check (150MB heap limit)
      () => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024),

      // RSS memory check (300MB limit)
      () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024),

      // Disk storage check (90% threshold)
      () =>
        this.disk.checkStorage("storage", {
          thresholdPercent: 0.9,
          path: process.platform === "win32" ? "C:\\" : "/",
        }),
    ]);
  }

  @Get("detailed")
  @Public()
  @HealthCheck()
  detailedCheck() {
    return this.health.check([
      () => this.db.detailedCheck("database_detailed"),
      () => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024),
      () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024),
    ]);
  }

  @Get("ready")
  @Public()
  @HealthCheck()
  readinessCheck() {
    return this.health.check([() => this.db.pingCheck("database")]);
  }

  @Get("live")
  @Public()
  @HealthCheck()
  livenessCheck() {
    return this.health.check([
      () => this.memory.checkHeap("memory_heap", 200 * 1024 * 1024),
    ]);
  }
}
