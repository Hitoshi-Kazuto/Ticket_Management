import pg from 'pg';
import dotenv from "dotenv";
// Load environment variables
dotenv.config();

const { Pool} = pg;

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
  });

export default pool;


