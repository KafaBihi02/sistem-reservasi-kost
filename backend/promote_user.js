import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        await pool.query("UPDATE users SET role = 'admin' WHERE email = 'testuser@example.com'");
        console.log('User testuser@example.com promoted to admin');
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
};

run();
