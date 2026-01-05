const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 ใส่ CORS ตรงนี้ (ก่อน routes)
app.use(cors({
    origin: "*", // หรือ "https://your-frontend.vercel.app"
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// routes
app.use("/api/auth", require("../routes/auth"));
app.use("/api/users", require("../routes/users"));

module.exports = app;
