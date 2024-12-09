import bcryptjs from 'bcryptjs';
//import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import Router from 'express';
import { verifyToken } from '../verifyToken.js';
import express from 'express';
import cors from 'cors';


const router = Router();





router.post('/groupMember/:group_id/join/', async (req, res) => {
    const { group_id } = req.params;
    const { user_id } = req.body;

 console.log(`Received user_id: ${user_id} for group_id: ${group_id}`)
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

router.post('/groupMember/:group_id/leave', async (req, res) => {
    const { group_id } = req.params;
    const { user_id } = req.body;
  
    try {
      const query = 'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING *';
      const result = await pool.query(query, [group_id, user_id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found in this group' });
      }
  
      res.status(200).json({ message: 'User has left the group' });
    } catch (error) {
      console.error('Error leaving group:', error);
      res.status(500).json({ error: 'Error leaving group' });
    }
  });

router.get('/groupMember/:group_id/members/:user_id', async (req, res) => {
    const { group_id, user_id } = req.params;
    console.log(group_id, user_id)
    try {
     
      const ownerQuery = 'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND role = $3';
      const ownerResult = await pool.query(ownerQuery, [group_id, user_id, 'owner']);
    
      const memberQuery = 'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND role = $3';
      const memberResult = await pool.query(memberQuery, [group_id, user_id, 'member']);
  
      if (ownerResult.rows.length > 0) {
        return res.json({ isMember: true, isOwner: true });
      } else if (memberResult.rows.length > 0) {
        return res.json({ isMember: true, isOwner: false });
      } else {
        return res.json({ isMember: false, isOwner: false });
      }
    } catch (error) {
      console.error('Error checking membership:', error);
      return res.status(500).json({ error: 'Error checking membership' });
    }
  });



export default router;