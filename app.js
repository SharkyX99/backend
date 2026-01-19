const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

app.use("/login", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));

module.exports = app;
