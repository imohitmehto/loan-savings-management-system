import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  // =============================
  // 🔐 App & Server Configuration
  // =============================
  port: process.env.PORT,
  host: process.env.HOST,
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  description: process.env.APP_DESCRIPTION,
  env: process.env.APP_ENV,
  key: process.env.APP_KEY,
  debug: process.env.APP_DEBUG,
  version: process.env.APP_VERSION,
  author: process.env.APP_AUTHOR,
  url: process.env.APP_URL,
  baseUrl: process.env.BASE_URL,
  apiPrefix: process.env.API_PREFIX,
  installed: process.env.APP_INSTALLED,

  // ====================
  // 🌐 Database (PostgreSQL + Prisma)
  // ====================
  database: {
    url: process.env.DATABASE_URL,
    min: process.env.DATABASE_MIN_CONNECTIONS,
    max: process.env.DATABASE_MAX_CONNECTIONS,
  },

  // ====================
  // 🗄️ Redis
  // ====================
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },

  // ====================
  // 🔐 JWT Authentication
  // ====================
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  otp: {
    ttlMs: process.env.TTLMS ?? 5 * 60 * 1000, // 5 minutes
    resendCooldownMs: process.env.RESENDCOOLDOWNMS ?? 30 * 1000, // 30s
    maxResend: process.env.MAXRESEND ?? 5,
  },

  // ====================
  // 📧 Email (NodeMailer)
  // ====================
  email: {
    from: process.env.EMAIL_FROM,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // ====================
  // 🔐 Google OAuth2
  // ====================
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },

  // ====================
  // 🔐 Payment Gateway (Razorpay)
  // ====================
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },

  // ====================
  // 🔐 CSRF Protection
  // ====================
  csrf: {
    enabled: process.env.CSRF_PROTECTION_ENABLED === "true",
    tokenName: process.env.CSRF_TOKEN_NAME,
    cookieName: process.env.CSRF_COOKIE_NAME,
    httpOnly: process.env.CSRF_COOKIE_HTTP_ONLY === "true",
    secure: process.env.CSRF_COOKIE_SECURE === "true",
    sameSite: process.env.CSRF_COOKIE_SAME_SITE,
  },

  // ====================
  // 🔐 Security Headers
  // ====================
  securityHeaders: process.env.SECURITY_HEADERS === "true",

  // ====================
  // 🔐 CORS
  // ====================
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["*"],
    methods: process.env.CORS_METHODS?.split(",") || [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(","),
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS?.split(","),
    maxAge: process.env.CORS_MAX_AGE,
    credentials: process.env.CORS_CREDENTIALS === "true",
  },

  // ====================
  // 🔐 Rate Limiting
  // ====================
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === "true",
    windowMs: process.env.RATE_LIMIT_WINDOW_MS,
    max: process.env.RATE_LIMIT_MAX_REQUESTS,
    message: process.env.RATE_LIMIT_MESSAGE,
  },

  // ====================
  // 🔐 Feature Flags
  // ====================
  features: {
    swagger: process.env.SWAGGER_ENABLED === "true",
  },
}));
