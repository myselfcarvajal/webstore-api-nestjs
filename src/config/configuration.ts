export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,

  jwt: {
    ACCESS_SECRET:
      process.env.ACCESS_SECRET ||
      '7J3K610XH2jvRfRP4R9I4YjXyJrkvdPIVymu0mw0yms=',

    ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN || '15m',
  },

  database: {
    MONGODB_CONNECTION: process.env.MONGODB_CONNECTION,
  },
});
