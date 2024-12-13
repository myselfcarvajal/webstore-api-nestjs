export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,

  database: {
    MONGODB_CONNECTION: process.env.MONGODB_CONNECTION,
  },
});

// MONGODB_CONNECTION
