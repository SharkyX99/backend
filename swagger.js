const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Backend API",
        version: "1.0.0",
        description: "API Documentation with Swagger",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: 'Development server'
        },
        {
            url: "https://013-backend.vercel.app",
            description: '🌐 Production Server'
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter: Bearer <token>'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    firstname: { type: 'string', example: 'Seed' },
                    fullname: { type: 'string', example: 'Seed User' },
                    lastname: { type: 'string', example: 'User' },
                    username: { type: 'string', example: 'seed_user' },
                    status: { type: 'string', example: 'active' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                },
            },
            NewUser: {
                type: 'object',
                required: ['firstname', 'fullname', 'lastname', 'username', 'password', 'status'],
                properties: {
                    firstname: { type: 'string' },
                    fullname: { type: 'string' },
                    lastname: { type: 'string' },
                    username: { type: 'string' },
                    password: { type: 'string' },
                    status: { type: 'string', example: 'active' },
                },
            },
            Login: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    paths: {
        "/ping": {
            get: {
                tags: ["Health"],
                summary: "Ping the server and database",
                responses: {
                    200: {
                        description: "OK",
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string' },
                                        time: { type: 'string', format: 'date-time' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Health summary",
                responses: {
                    200: { description: 'OK' }
                }
            }
        },
        "/api/data": {
            get: {
                tags: ["Misc"],
                summary: "Sample payload",
                responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object' } } } } }
            }
        },
        "/login": {
            post: {
                tags: ["Authentication"],
                summary: "User login",
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } },
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' }, message: { type: 'string' } } } } } },
                    400: { description: 'Bad Request' },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        "/logout": {
            post: {
                tags: ["Authentication"],
                summary: "User logout",
                responses: { 200: { description: 'OK' }, 401: { description: 'No token' }, 403: { description: 'Invalid token' } }
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"], // อ่าน comment จาก route
};

module.exports = swaggerJSDoc(options);
