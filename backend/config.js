import pg from 'pg';
const { Pool} = pg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Helpdesk_Management",
    password: "password",
    port: 5432,
  });

export default pool;


