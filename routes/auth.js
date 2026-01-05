/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: ระบบยืนยันตัวตน
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 🔐 Login
 *     tags: [Auth]
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
 *         description: Login success
 */
router.post("/login", login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 🚪 Logout
 *     tags: [Auth]
 *     security:
 *       - Auth: []
 *     responses:
 *       200:
 *         description: Logout success
 */
router.post("/logout", authMiddleware, logout);
