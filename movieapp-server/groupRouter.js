import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import Router from 'express';
import { verifyToken } from '../verifyToken.js';




const router = Router();


router.post('/api/groups', async (req, res) => {
   
    const { name, creator_user_id } = req.body;
    if (!name || !creator_user_id) {
        return res.status(400).json({ error: 'Name and creator_user_id are required' });
    }
    try {
    const query = 'INSERT INTO user_group (name, creator_user_id, created_date) VALUES ($1, $2, NOW()) RETURNING *';
    const values = [name, creator_user_id];
    const result = await pool.query(query, values);
    res.status(201).json({ group: result.rows[0] });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'bugipoistelua' });
}
});

router.delete('/api/groups:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const groupQuery = 'SELECT * FROM user_group WHERE group_id = $1';
        const groupResult = await pool.query(groupQuery, [id]);

        if (groupResult.rows.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
      }
      const deleteQuery = 'DELETE FROM user_group WHERE group_id = $1';
        await pool.query(deleteQuery, [id]);
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Database error' });
    }
  });







export default router;