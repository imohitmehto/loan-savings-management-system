export default () => ({
  app: {
    name: process.env.APP_NAME || "backend",
    description: process.env.APP_DESCRIPTION || "",
    environment: process.env.NODE_ENV || "development",
    appEnv: process.env.APP_ENV || "development",
    key: process.env.APP_KEY,
    debug: process.env.APP_DEBUG === "true",
    version: process.env.APP_VERSION || "1.0.0",
    author: process.env.APP_AUTHOR || "",
    url: process.env.APP_URL,
    baseUrl: process.env.BASE_URL,
    apiPrefix: process.env.API_PREFIX || "api",
    installed: process.env.APP_INSTALLED === "true",
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT || "5000", 10),
  },

  database: {
    url: process.env.DATABASE_URL,
    minConnections: parseInt(process.env.DATABASE_MIN_CONNECTIONS || "1", 10),
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || "10", 10),
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || null,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  email: {
    from: process.env.EMAIL_FROM,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
    endpoint: process.env.AWS_ENDPOINT,
    url: process.env.AWS_URL,
  },

  session: {
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME || "session_id",
    cookieName: process.env.SESSION_COOKIE_NAME || "session_cookie",
    maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE || "3600000", 10),
    httpOnly: process.env.SESSION_COOKIE_HTTP_ONLY === "true",
    secure: process.env.SESSION_COOKIE_SECURE === "true",
  },

  csrf: {
    enabled: process.env.CSRF_PROTECTION_ENABLED === "true",
    tokenName: process.env.CSRF_TOKEN_NAME || "_csrf",
    cookieName: process.env.CSRF_COOKIE_NAME || "csrf_token",
    cookieHttpOnly: process.env.CSRF_COOKIE_HTTP_ONLY === "true",
    cookieSecure: process.env.CSRF_COOKIE_SECURE === "true",
    // sameSite: process.env.CSRF_COOKIE_SAME_SITE || "Lax",
  },

  security: {
    headers: process.env.SECURITY_HEADERS === "true",
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["*"],
    methods: process.env.CORS_METHODS || "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders:
      process.env.CORS_ALLOWED_HEADERS || "Content-Type,Authorization",
    exposedHeaders:
      process.env.CORS_EXPOSED_HEADERS || "Content-Length,Content-Disposition",
    maxAge: parseInt(process.env.CORS_MAX_AGE || "86400", 10),
    credentials: process.env.CORS_CREDENTIALS === "true",
  },

  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === "true",
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    message:
      process.env.RATE_LIMIT_MESSAGE ||
      "Too many requests, please try again later.",
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    filePath: process.env.LOG_FILE_PATH || "./logs/app.log",
    maxSize: process.env.LOG_MAX_SIZE || "10m",
    maxFiles: parseInt(process.env.LOG_MAX_FILES || "5", 10),
    format: process.env.LOG_FORMAT || "json",
  },

  monitoring: {
    enabled: process.env.MONITORING_ENABLED === "true",
    service: process.env.MONITORING_SERVICE || "prometheus",
    port: parseInt(process.env.MONITORING_PORT || "9090", 10),
    endpoint: process.env.MONITORING_ENDPOINT || "/metrics",
  },

  features: {
    newUi: process.env.FEATURE_FLAG_NEW_UI === "true",
    experimental: process.env.FEATURE_FLAG_EXPERIMENTAL === "true",
    enableDarkMode: process.env.FEATURE_FLAG_ENABLE_DARK_MODE === "true",
    enableNotifications:
      process.env.FEATURE_FLAG_ENABLE_NOTIFICATIONS === "true",
    enableAnalytics: process.env.FEATURE_FLAG_ENABLE_ANALYTICS === "true",
    enableSocialLogin: process.env.FEATURE_FLAG_ENABLE_SOCIAL_LOGIN === "true",
    enableMultiLanguage:
      process.env.FEATURE_FLAG_ENABLE_MULTI_LANGUAGE === "true",
    enableTwoFactorAuth:
      process.env.FEATURE_FLAG_ENABLE_TWO_FACTOR_AUTH === "true",
    enableEmailVerification:
      process.env.FEATURE_FLAG_ENABLE_EMAIL_VERIFICATION === "true",
    enableSmsVerification:
      process.env.FEATURE_FLAG_ENABLE_SMS_VERIFICATION === "true",
    enablePushNotifications:
      process.env.FEATURE_FLAG_ENABLE_PUSH_NOTIFICATIONS === "true",
    enableFileUpload: process.env.FEATURE_FLAG_ENABLE_FILE_UPLOAD === "true",
    enableApiAccess: process.env.FEATURE_FLAG_ENABLE_API_ACCESS === "true",
    enableWebhooks: process.env.FEATURE_FLAG_ENABLE_WEBHOOKS === "true",
  },

  maintenance: {
    mode: process.env.MAINTENANCE_MODE === "true",
    message:
      process.env.MAINTENANCE_MESSAGE ||
      "The application is currently undergoing maintenance. Please check back later.",
  },

  errorPages: {
    error404: process.env.ERROR_404_PAGE || "./public/404.html",
    error500: process.env.ERROR_500_PAGE || "./public/500.html",
  },
});
