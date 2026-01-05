/**
 * @swagger
 * tags:
 *   name: Users
 *   description: จัดการผู้ใช้งาน
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 📋 Get all users
 *     tags: [Users]
 *     security:
 *       - Auth: []
 *     responses:
 *       200:
 *         description: List users
 */
router.get("/", authMiddleware, getUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: ➕ Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: User created
 */
router.post("/", createUser);
