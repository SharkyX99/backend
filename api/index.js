const serverless = require('serverless-http');
const { app } = require('../index.js');

// Wrap the serverless handler to add simple invocation and error logging
const handler = serverless(app);

module.exports = async (req, res) => {
    try {
        console.log('Vercel function invoked:', req.method, req.url);
        return await handler(req, res);
    } catch (err) {
        console.error('Vercel handler error:', err && err.stack ? err.stack : err);
        // Ensure a 500 is returned on unexpected errors
        try {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error');
        } catch (e) {
            // ignore
        }
    }
};
