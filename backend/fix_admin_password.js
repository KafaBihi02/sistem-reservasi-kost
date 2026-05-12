import bcrypt from 'bcrypt';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_iTCY9my1UjKt@ep-little-wind-ao1eh7ob-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function fixAdminPassword() {
  try {
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    
    // Update admin@kost.com
    const result1 = await pool.query(
        "UPDATE users SET password = $1 WHERE email = 'admin@kost.com'", 
        [hashedAdmin]
    );
    
    if (result1.rowCount > 0) {
        console.log("Berhasil memperbarui password untuk admin@kost.com menjadi 'admin123'");
    } else {
        console.log("Akun admin@kost.com tidak ditemukan di database.");
    }

    // Update admin@kostku.com if it exists
    const result2 = await pool.query(
        "UPDATE users SET password = $1 WHERE email = 'admin@kostku.com'", 
        [hashedAdmin]
    );

    if (result2.rowCount > 0) {
        console.log("Berhasil memperbarui password untuk admin@kostku.com menjadi 'admin123'");
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

fixAdminPassword();
