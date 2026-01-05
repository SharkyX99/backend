const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
}));

/* ROOT ROUTE (ห้ามลบ) */
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend API running on Vercel",
    });
});

/* ROUTES */
app.use("/api/users", require("../routes/users"));

/* SWAGGER */
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Backend API",
            version: "1.0.0",
        },
        servers: [
            {
                url: "https://011-backend.vercel.app",
            },
        ],
    },
    apis: ["../routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
