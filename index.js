const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* ---------- Routes ---------- */
const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

/* ---------- Swagger ---------- */
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Backend API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://011-backend.vercel.app",
      description: "Vercel server",
    },
    {
      url: "http://localhost:3000",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: ["./routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ---------- Local only ---------- */
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📄 Swagger: http://localhost:${PORT}/api-docs`);
  });
}

/* ---------- Export for Vercel ---------- */
module.exports = app;
