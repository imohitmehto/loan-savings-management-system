import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    // Log the error details
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : "",
    );

    // Shape error response
    const errorResponse =
      typeof message === "string"
        ? {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: message,
          }
        : {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: (message as any).message || message,
            ...((message as any).error && { details: (message as any).error }),
          };

    response.status(status).json(errorResponse);
  }
}
