import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  // =============================
  // 🔐 App & Server Configuration
  // =============================
  PORT: Joi.number().default(5000),
  HOST: Joi.string().default("0.0.0.0"),
  NODE_ENV: Joi.string()
    .valid("development", "production", "staging", "test")
    .default("development"),
  APP_NAME: Joi.string().required(),
  APP_DESCRIPTION: Joi.string().allow(""),
  APP_ENV: Joi.string()
    .valid("development", "production", "staging", "test")
    .default("development"),
  APP_KEY: Joi.string().required(),
  APP_DEBUG: Joi.boolean().default(false),
  APP_VERSION: Joi.string().default("1.0.0"),
  APP_AUTHOR: Joi.string().allow(""),
  APP_URL: Joi.string().uri().required(),
  BASE_URL: Joi.string().uri().required(),
  API_PREFIX: Joi.string().default("api"),
  APP_INSTALLED: Joi.boolean().default(true),

  // ====================
  // 🌐 Database (PostgreSQL + Prisma)
  // ====================
  DATABASE_URL: Joi.string().uri().required(),
  DATABASE_MIN_CONNECTIONS: Joi.number().default(1),
  DATABASE_MAX_CONNECTIONS: Joi.number().default(10),

  // ====================
  // 🗄️ Redis
  // ====================
  REDIS_HOST: Joi.string().default("localhost"),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow(""),

  // ====================
  // 🔐 JWT Authentication
  // ====================
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("15m"),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),

  // ====================
  // 📧 Email (NodeMailer)
  // ====================
  EMAIL_FROM: Joi.string().email().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().default(465),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),

  // ====================
  // 📱 SMS (Twilio)
  // ====================
  TWILIO_ACCOUNT_SID: Joi.string().allow(""),
  TWILIO_AUTH_TOKEN: Joi.string().allow(""),
  TWILIO_PHONE_NUMBER: Joi.string().allow(""),

  // ====================
  // 🔐 Google OAuth2
  // ====================
  GOOGLE_CLIENT_ID: Joi.string().allow(""),
  GOOGLE_CLIENT_SECRET: Joi.string().allow(""),
  GOOGLE_CALLBACK_URL: Joi.string().uri().allow(""),

  // ====================
  // 🔐 Payment Gateway (Razorpay)
  // ====================
  RAZORPAY_KEY_ID: Joi.string().allow(""),
  RAZORPAY_KEY_SECRET: Joi.string().allow(""),

  // ====================
  // 🔐 CSRF Protection
  // ====================
  CSRF_PROTECTION_ENABLED: Joi.boolean().default(true),
  CSRF_TOKEN_NAME: Joi.string().default("_csrf"),
  CSRF_COOKIE_NAME: Joi.string().default("csrf_token"),
  CSRF_COOKIE_HTTP_ONLY: Joi.boolean().default(true),
  CSRF_COOKIE_SECURE: Joi.boolean().default(false),
  CSRF_COOKIE_SAME_SITE: Joi.string()
    .valid("Strict", "Lax", "None")
    .default("Lax"),

  // ====================
  // 🔐 Security Headers
  // ====================
  SECURITY_HEADERS: Joi.boolean().default(true),

  // ====================
  // 🔐 CORS
  // ====================
  CORS_ORIGIN: Joi.string().allow("").default("*"),
  CORS_METHODS: Joi.string().default("GET,POST,PUT,PATCH,DELETE,OPTIONS"),
  CORS_ALLOWED_HEADERS: Joi.string().allow(""),
  CORS_EXPOSED_HEADERS: Joi.string().allow(""),
  CORS_MAX_AGE: Joi.number().default(86400),
  CORS_CREDENTIALS: Joi.boolean().default(true),

  // ====================
  // 🔐 Rate Limiting
  // ====================
  RATE_LIMIT_ENABLED: Joi.boolean().default(true),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  RATE_LIMIT_MESSAGE: Joi.string().default(
    "Too many requests, please try again later.",
  ),

  // ====================
  // 🔐 Logging
  // ====================
  LOG_LEVEL: Joi.string()
    .valid("error", "warn", "info", "debug", "verbose")
    .default("info"),
  LOG_FILE_PATH: Joi.string().default("./logs/app.log"),
  LOG_MAX_SIZE: Joi.string().default("10m"),
  LOG_MAX_FILES: Joi.number().default(5),
  LOG_FORMAT: Joi.string().valid("json", "text").default("json"),

  // ====================
  // 🔐 Feature Flags
  // ====================
  SWAGGER_ENABLED: Joi.boolean().default(true),

  // ====================
  // 🔐 Maintenance Mode
  // ====================
  MAINTENANCE_MODE: Joi.boolean().default(false),
  MAINTENANCE_MESSAGE: Joi.string()
    .allow("")
    .default(
      "The application is currently undergoing maintenance. Please check back later.",
    ),
});
