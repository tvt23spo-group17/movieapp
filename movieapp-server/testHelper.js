import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { hash } = bcryptjs;
const { sign } = jwt;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeDb = async () => {
  const sql = fs.readFileSync(path.resolve(__dirname, './test_db_setup.sql'), 'utf8');
  await pool.query(sql);
};

const insertTestUser = async (email, password) => {
  const hashedPassword = await hash(password, 10);
  await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2)',
    [email, hashedPassword]
  );
};

const getToken = (email) => {
  return sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const insertMovieMapping = async (localTitle, releaseYear, tmdbId) => {
    const result = await pool.query(
      'INSERT INTO movie_mappings (local_title, release_year, tmdb_id) VALUES ($1, $2, $3) RETURNING tmdb_id',
      [localTitle, releaseYear, tmdbId]
    );
    return result.rows[0].tmdb_id;
};

const insertReview = async (userId, tmdbId, text, stars) => {
    await pool.query(
      'INSERT INTO review (user_id, tmdb_id, text, stars) VALUES ($1, $2, $3, $4)',
      [userId, tmdbId, text, stars]
    );
};

export { initializeDb, insertTestUser, getToken, insertMovieMapping, insertReview };