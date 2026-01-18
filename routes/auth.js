// BACKEND/Routes/auth.js
const express = require('express');
const router = express.Router();

// 1. เส้นทางสมัครสมาชิก (POST /register)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // TODO: ตรงนี้ใส่โค้ดบันทึกลง Database (เรียกใช้ไฟล์จาก folder config)
        console.log('Register Request:', username, password);

        // จำลองการตอบกลับ
        res.status(201).json({ status: 'ok', message: 'สร้างบัญชีสำเร็จ' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 2. เส้นทางล็อกอิน (POST /login)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // TODO: ตรงนี้ใส่โค้ดเช็ค Database และสร้าง Token
        console.log('Login Request:', username, password);

        // จำลองการตอบกลับ
        res.status(200).json({ status: 'ok', message: 'ล็อกอินสำเร็จ', token: 'sample-token' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;