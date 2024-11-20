import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import pkg from 'pg';
const { Pool } = pkg;
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import tmdbRouter from './routes/tmdbRouter.js';

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id, email',
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }
        const newUser = result.rows[0];
        res.status(201).json({
          message: 'User registered successfully',
          user: { id: newUser.user_id, email: newUser.email },
        });
      }
    );
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    console.log('User from database:', user);
    const passwordMatch = bcryptjs.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'User logged in successfully',
      token: token,
      user: { id: user.user_id, email: user.email },
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

router.delete('/delete-account', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  try {
    const userResult = await pool.query('SELECT password FROM users WHERE user_id = $1', [userId]);
    const user = userResult.rows[0];
    const passwordMatch = bcryptjs.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});


function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ message: 'Invalid token' });
      } else {
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
  });
});

app.use('/', router);
app.use('/api', tmdbRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});