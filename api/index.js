const serverless = require('serverless-http');
const { app } = require('../index.js');

// Export the serverless handler for Vercel/Serverless platforms
module.exports = serverless(app);
