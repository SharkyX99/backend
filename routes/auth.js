// BACKEND/Routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // ตัวช่วยเข้ารหัส
const jwt = require("jsonwebtoken"); // ตัวช่วยสร้าง Token
const pool = require("../config/db"); // เรียกใช้ Database ที่คุณส่งมา

// Secret Key สำหรับสร้าง Token (ควรย้ายไปใส่ใน .env ภายหลัง)
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_key_1234";

// 1. เส้นทางสมัครสมาชิก (POST /register)

router.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      firstname,
      lastname,
      fullname,
      address,
      sex,
      birthday,
    } = req.body;

    // เช็คว่าส่งข้อมูลมาครบไหม (Simple validation)
    if (!username || !password || !firstname || !lastname) {
      return res
        .status(400)
        .json({ message: "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน" });
    }

    // เช็คว่ามี Username นี้อยู่แล้วหรือยัง?
    // ใช้ tbl_users แทน users
    const [existingUsers] = await pool.query(
      "SELECT * FROM tbl_users WHERE username = ?",
      [username],
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" });
    }

    // เข้ารหัสรหัสผ่าน (Hash Password)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // บันทึกลง Database (เพิ่ม field อิ่นๆ ให้ครบ)
    // role default อาจจะไม่มีใน schema tbl_users ถ้ามีก็ใส่ ถ้าไม่มีก็ข้าม หรือเพิ่ม column
    // สมมติ tbl_users ไม่ได้บังคับ role หรือมี default value
    await pool.query(
      "INSERT INTO tbl_users (username, password, firstname, lastname, fullname, address, sex, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        username,
        hashedPassword,
        firstname,
        lastname,
        fullname,
        address,
        sex,
        birthday,
      ],
    );

    res.status(201).json({ status: "ok", message: "สมัครสมาชิกสำเร็จ" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์: " + error.message,
    });
  }
});

// 2. เส้นทางล็อกอิน (POST /login)
/**
 * @openapi
 * /login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *                 username:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ค้นหา User ใน Database (tbl_users)
    const [users] = await pool.query(
      "SELECT * FROM tbl_users WHERE username = ?",
      [username],
    );
    const user = users[0];

    // ถ้าหาไม่เจอ หรือ รหัสผ่านไม่ถูกต้อง
    if (!user) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // ตรวจสอบรหัสผ่าน (เทียบรหัสสด กับ รหัสที่ Hash ไว้)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง Token (JWT)
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role || "user" },
      JWT_SECRET,
      { expiresIn: "30d" }, // Token หมดอายุใน 30 วัน
    );

    // ส่ง Token กลับไปให้ Frontend
    res.status(200).json({
      status: "ok",
      message: "ล็อกอินสำเร็จ",
      token: token,
      role: user.role || "user",
      username: user.username,
      // ส่ง info อื่นๆ ไปด้วยก็ได้
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});

module.exports = router;
