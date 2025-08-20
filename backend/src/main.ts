import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, Logger } from "@nestjs/common";
import { PrismaService } from "./infrastructure/database/prisma.service";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    const configService = app.get(ConfigService);

    // Global Validation Pipe
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    // Centralized application logger
    app.useLogger(logger);

    // Request logging in development only
    if (configService.get("app.environment") === "development") {
      app.use(morgan("dev"));
    }

    // Global route prefix
    app.setGlobalPrefix(configService.get("app.apiPrefix") || "api");

    // Security middleware
    app.use(
      helmet({
        contentSecurityPolicy:
          configService.get("app.environment") === "production",
      }),
    );

    // Enable cookie parsing if needed
    app.use(cookieParser());

    // Response compression
    app.use(compression());

    // Rate limiting (conditionally enabled)
    if (configService.get<boolean>("rateLimit.enabled")) {
      app.use(
        rateLimit({
          windowMs:
            configService.get<number>("rateLimit.windowMs") || 15 * 60 * 1000, // 15 min
          max: configService.get<number>("rateLimit.maxRequests") || 100,
          message:
            configService.get<string>("rateLimit.message") ||
            "Too many requests, please try again later.",
          standardHeaders: true,
          legacyHeaders: false,
        }),
      );
    }

    // CORS configuration
    app.enableCors({
      origin: configService.get<string[]>("cors.origin") || ["*"],
      credentials: configService.get<boolean>("cors.credentials") ?? true,
      methods:
        configService.get<string>("cors.methods") ||
        "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders:
        configService.get<string>("cors.allowedHeaders") ||
        "Content-Type,Accept,Authorization",
      exposedHeaders:
        configService.get<string>("cors.exposedHeaders") ||
        "Content-Length,Content-Disposition",
      maxAge: configService.get<number>("cors.maxAge") || 86400,
    });

    // Enable "trust proxy" if running behind a proxy/load balancer
    // if (configService.get<string>("app.trustProxy") === "true") {
    //   app.enable("trust proxy");
    // }

    // Prisma shutdown hooks
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);

    // Server listen
    const port = configService.get<number>("app.port") || 5000;
    await app.listen(port, "0.0.0.0");

    logger.log(
      `🚀 Server ready at ${configService.get<string>("app.baseUrl") || "http://localhost"}:${port} (${configService.get<string>("app.environment") || "development"})`,
    );
  } catch (error) {
    // Emergency logging for bootstrap errors
    const logger = new Logger("Bootstrap");
    logger.error("❌ Application failed to start", error.stack || error);
    process.exit(1);
  }
}

bootstrap();
