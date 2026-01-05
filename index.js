const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/auth");

/**
 * @openapi
 * /api/users:
 *   get:
 *      tags: [Users]
 *      summary: Get all users
 *      responses:
 *        200:
 *          description: OK
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, firstname, fullname, lastname FROM tbl_users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Query failed' });
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *      tags: [Users]
 *      summary: Get user by id
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: OK
 *        404:
 *          description: User not found
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT id, firstname, fullname, lastname FROM tbl_users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Query failed' });
  }
});

/**
 * @openapi
 * /api/users:
 *   post:
 *      tags: [Users]
 *      summary: Create a new user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstname:
 *                  type: string
 *                fullname:
 *                  type: string
 *                lastname:
 *                  type: string
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *                status:
 *                  type: string
 *      responses:
 *        200:
 *          description: OK
 */
router.post('/', async (req, res) => {
  const { firstname, fullname, lastname, username, password, status } = req.body;
  try {
    if (!password) return res.status(400).json({ error: 'Password is required' });
    // เข้ารหัส password
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO tbl_users (firstname, fullname, lastname, username, password, status) VALUES (?, ?, ?, ?, ?, ?)',
      [firstname, fullname, lastname, username, hashedPassword, status]
    );
    res.status(200).json({ id: result.insertId, firstname, fullname, lastname, username, password, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *      tags: [Users]
 *      summary: Update user by id
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstname:
 *                  type: string
 *                fullname:
 *                  type: string
 *                lastname:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: OK
 *        404:
 *          description: User not found
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, fullname, lastname, password } = req.body;
  try {
    let query = 'UPDATE tbl_users SET firstname = ?, fullname = ?, lastname = ?';
    const params = [firstname, fullname, lastname];
    // ถ้ามี password ใหม่ให้ hash แล้วอัปเดตด้วย
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }
    query += ' WHERE id = ?';
    params.push(id);
    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *      tags: [Users]
 *      summary: Delete user by id
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: OK
 *        404:
 *          description: User not found
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM tbl_users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;