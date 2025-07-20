export default () => ({
  app: {
    name: "MyApp",
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
  },

  database: {
    url: process.env.DATABASE_URL,
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
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
  },

  twilio: {
    sid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },

  //   bcrypt: {
  //     saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  //   },

  //   throttle: {
  //     ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
  //     limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
  //   },

  //   logging: {
  //     level: process.env.LOG_LEVEL || 'info',
  //   },

  //   features: {
  //     enableSignup: process.env.ENABLE_SIGNUP === 'true',
  //   },

  //   payment: {
  //     razorpayKey: process.env.RAZORPAY_KEY,
  //     razorpaySecret: process.env.RAZORPAY_SECRET,
  //   },
});
