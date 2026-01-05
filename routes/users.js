const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");
const auth = require("../middlewares/auth");

/* ---------- JWT SECRET (ต้องอยู่บนสุด) ---------- */
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
}

/* ---------- PROTECTED ROUTE ---------- */
/* GET /api/users */
router.get("/", auth, async (req, res) => {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
});

/* ---------- LOGIN ---------- */
/* POST /api/users/login */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "2h" }
    );

    res.json({ token });
});

module.exports = router;
