import * as Joi from "joi";

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("1h"),
  //   BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  //   THROTTLE_TTL: Joi.number().default(60),
  //   THROTTLE_LIMIT: Joi.number().default(10),
  //   LOG_LEVEL: Joi.string().default('info'),
  //   ENABLE_SIGNUP: Joi.boolean().default(true),
  //   RAZORPAY_KEY: Joi.string(),
  //   RAZORPAY_SECRET: Joi.string(),
});
