import bcrypt from 'bcrypt';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_iTCY9my1UjKt@ep-little-wind-ao1eh7ob-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function fixUserPassword() {
  try {
    const hashedUser = await bcrypt.hash('user123', 10);
    
    // Update user@example.com
    const result = await pool.query(
        "UPDATE users SET password = $1 WHERE email = 'user@example.com'", 
        [hashedUser]
    );
    
    if (result.rowCount > 0) {
        console.log("Berhasil memperbarui password untuk user@example.com menjadi 'user123'");
    } else {
        console.log("Akun user@example.com tidak ditemukan di database.");
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

fixUserPassword();
