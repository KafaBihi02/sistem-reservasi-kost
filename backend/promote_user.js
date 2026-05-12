import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        const hashedAdmin = await bcrypt.hash('admin123', 10);
        await pool.query("UPDATE users SET password = $1, role = 'admin' WHERE email = 'admin@kostku.com'", [hashedAdmin]);
        console.log('Password for admin@kostku.com set to admin123 and role set to admin');
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
};

run();
