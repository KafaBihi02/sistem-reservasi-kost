import bcrypt from 'bcrypt';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_iTCY9my1UjKt@ep-little-wind-ao1eh7ob-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function resetPasswords() {
  try {
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedAdmin, 'admin@kostku.com']);
    console.log("Updated admin@kostku.com password to 'admin123'");

    const hashedUser = await bcrypt.hash('test1234', 10);
    await pool.query('INSERT INTO users (email, password, role, status) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET password = $2', ['testuser@example.com', hashedUser, 'penyewa', 'aktif']);
    console.log("Upserted testuser@example.com with password 'test1234'");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

resetPasswords();
