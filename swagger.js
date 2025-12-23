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
        },
    ],
    components: {
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
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"], // อ่าน comment จาก route
};

module.exports = swaggerJSDoc(options);
