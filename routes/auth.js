const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../config/db");



const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    if (rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
    }

    const user = rows[0];

    // ตัวอย่าง (ถ้า hash จริงให้ใช้ bcrypt)
    if (user.password !== password) {
        return res.status(401).json({ message: "Password incorrect" });
    }

    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );


    res.json({ token });
});

module.exports = router;
