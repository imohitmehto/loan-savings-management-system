import { join } from "path";
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
import { NestExpressApplication } from "@nestjs/platform-express";
import { json, urlencoded } from "express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import timeout from "connect-timeout";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    const nodeEnv = configService.get<string>("app.nodeEnv", "development");
    const isProduction = nodeEnv === "production";

    /**
     * Helmet (Security headers)
     */
    app.use(
      helmet(
        isProduction
          ? {
              contentSecurityPolicy: {
                directives: {
                  defaultSrc: ["'self'"],
                  scriptSrc: ["'self'"],
                  styleSrc: ["'self'", "https:"],
                  imgSrc: ["'self'", "data:"],
                  objectSrc: ["'none'"],
                  upgradeInsecureRequests: [],
                },
              },
              referrerPolicy: { policy: "no-referrer" },
              crossOriginEmbedderPolicy: true,
              crossOriginResourcePolicy: { policy: "same-origin" },
              dnsPrefetchControl: { allow: false },
              frameguard: { action: "deny" },
              hidePoweredBy: true,
              hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
              },
              ieNoOpen: true,
              noSniff: true,
              permittedCrossDomainPolicies: { permittedPolicies: "none" },
              xssFilter: true,
            }
          : {
              contentSecurityPolicy: false,
              frameguard: { action: "deny" },
              noSniff: true,
              xssFilter: true,
            },
      ),
    );

    app.use(cookieParser());
    app.use(compression());

    /**
     * Rate limiting
     */
    const rateLimitConfig = configService.get("app.rateLimit");
    if (rateLimitConfig?.enabled) {
      app.use(
        rateLimit({
          windowMs: rateLimitConfig.windowMs,
          max: rateLimitConfig.max,
          message: rateLimitConfig.message,
          standardHeaders: true,
          legacyHeaders: false,
        }),
      );
    }

    /**
     * Body parsers
     */
    app.use(
      json({
        limit: isProduction ? "10mb" : "50mb",
      }),
    );
    app.use(
      urlencoded({
        extended: true,
        limit: isProduction ? "10mb" : "50mb",
      }),
    );

    app.use(timeout(isProduction ? "30s" : "2m"));

    /**
     * Global Pipes & Interceptors
     */
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: isProduction,
        disableErrorMessages: isProduction,
      }),
    );

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.setGlobalPrefix(configService.get("app.apiPrefix") || "api");

    /**
     * Swagger Docs
     */
    const swaggerEnabled = configService.get<boolean>(
      "app.features.swagger",
      !isProduction,
    );

    if (swaggerEnabled) {
      const swaggerConfig = new DocumentBuilder()
        .setTitle(configService.get<string>("app.name", "API"))
        .setDescription(
          configService.get<string>("app.description", "API Docs"),
        )
        .setVersion(configService.get<string>("app.version", "1.0"))
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, swaggerConfig);
      SwaggerModule.setup("api/docs", app, document);
    }

    app.useLogger(logger);

    /**
     * CORS
     */
    // const corsConfig = configService.get("app.cors");
    // app.enableCors({
    //   origin: (origin, callback) => {
    //     if (
    //       !origin ||
    //       (!isProduction &&
    //         (origin.includes("localhost") || origin.includes("127.0.0.1"))) ||
    //       corsConfig.origin.includes(origin)
    //     ) {
    //       callback(null, true);
    //     } else {
    //       callback(new Error("CORS not allowed for this origin"));
    //     }
    //   },
    //   credentials: corsConfig.credentials,
    //   methods: corsConfig.methods,
    //   allowedHeaders: corsConfig.allowedHeaders,
    //   exposedHeaders: corsConfig.exposedHeaders,
    //   maxAge: corsConfig.maxAge,
    // });

    if (configService.get("app.environment") === "development") {
      app.use(morgan("dev"));
    }

    /**
     * Static Files
     */
    app.useStaticAssets(join(__dirname, "..", "uploads"), {
      prefix: "/uploads",
    });

    /**
     * Prisma shutdown hooks
     */
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);

    /**
     * Graceful shutdown
     */
    process.on("SIGINT", async () => {
      logger.log("SIGINT received. Shutting down gracefully...");
      await app.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      logger.log("SIGTERM received. Shutting down gracefully...");
      await app.close();
      process.exit(0);
    });

    /**
     * Start server
     */
    const port = configService.get<number>("app.port", 3000);
    const host = configService.get<string>(
      "app.host",
      isProduction ? "0.0.0.0" : "localhost",
    );

    await app.listen(port, host);

    logger.log(
      `🚀 Application running on http://${host}:${port} in ${nodeEnv} mode`,
    );

    if (swaggerEnabled) {
      logger.log(`📑 Swagger docs: http://${host}:${port}/api/docs`);
    }
  } catch (error) {
    logger.error("❌ Application failed to start", error.stack || error);
    process.exit(1);
  }
}

bootstrap();
