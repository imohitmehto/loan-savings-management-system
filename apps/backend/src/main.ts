import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import compression from "compression";
import { ValidationPipe, Logger } from "@nestjs/common";
import { PrismaService } from "./infrastructure/database/prisma.service";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const logger = new Logger("Main");
  const configService = app.get(ConfigService);

  // Enable Helmet for secure HTTP headers
  app.use(helmet());

  // Response compression
  app.use(compression());

  // Rate Limiting (Prevent brute-force & abuse)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: configService.get<string>("FRONTEND_URL") || "*",
    credentials: true,
  });

  // Global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown fields
      forbidNonWhitelisted: true, // Throw error on extra fields
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  // Prisma Shutdown Hook
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const port = configService.get<number>("PORT") || 5000;
  await app.listen(port);
  logger.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();
