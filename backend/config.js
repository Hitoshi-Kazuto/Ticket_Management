import pg from 'pg';
import dotenv from "dotenv";
// Load environment variables
dotenv.config();

const { Pool} = pg;

const pool = new Pool({
  // connectionString: process.env.POSTGRES_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  databse: process.env.DB_NAME,
  port: process.env.DB_PORT
});

export default pool;


