import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const openDb = () => {
  const isTestEnv = process.env.NODE_ENV === 'test';
    const pool = new Pool({
      user: isTestEnv ? process.env.TEST_DB_USER : process.env.DB_USER,
      host: isTestEnv ? process.env.TEST_DB_HOST : process.env.DB_HOST,
      database: isTestEnv ? process.env.TEST_DB_NAME : process.env.DB_NAME,
      password: isTestEnv ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
      port: isTestEnv ? process.env.TEST_DB_PORT : process.env.DB_PORT,
  });
  return pool;
}

const pool = openDb();
export { pool };