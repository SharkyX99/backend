require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ตรวจ JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
}

app.use(cors({ origin: "*", allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());

// ROOT (จำเป็นสำหรับ Vercel)
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend API running on Vercel",
    });
});

// AUTH & USERS
app.use("/api/auth", require("../routes/auth"));
app.use("/api/users", require("../routes/users"));

// ตัวอย่าง ping
app.get("/ping", (req, res) => res.json({ status: "ok" }));


app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend API running on Vercel",
    });
});


module.exports = app;
