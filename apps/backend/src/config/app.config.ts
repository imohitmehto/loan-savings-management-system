export default () => ({
    app: {
        name: 'MyApp',
        environment: process.env.NODE_ENV,
        port: process.env.PORT,
    },

    database: {
        url: process.env.DATABASE_URL,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
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
