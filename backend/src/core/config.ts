export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '2001', 10),
  database: {
    url:
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/rippledesk-shopify-app',
  },
});
