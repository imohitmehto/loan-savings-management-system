import { Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
// This module provides a custom logger service that can be used throughout the application.
