import bcryptjs from 'bcryptjs';
//import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import Router from 'express';
import { verifyToken } from '../verifyToken.js';
import express from 'express';
import cors from 'cors';


const router = Router();





router.post('/groupMember/:group_id/join', async (req, res) => {
    const { group_id } = req.params;
    const { user_id } = req.body;

 //console.log()
    try {
       
      const result =  await pool.query(
          `INSERT INTO join_request (group_id, user_id, status) 
           VALUES ($1, $2, 'pending') RETURNING request_id`,
          [group_id, user_id]
      );
        res.json({ message: 'Request sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send request' });
    }
});



export default router;