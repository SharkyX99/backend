const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // ตัวอย่าง user mock
    const user = {
        id: 1,
        username: "admin",
        passwordHash: await bcrypt.hash("1234", 10),
    };

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch || username !== user.username) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users (Protected)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", auth, (req, res) => {
    res.json({
        message: "Authorized ✅",
        user: req.user,
    });
});

module.exports = router;
