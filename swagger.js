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
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"], // อ่าน comment จาก route
};

module.exports = swaggerJSDoc(options);
