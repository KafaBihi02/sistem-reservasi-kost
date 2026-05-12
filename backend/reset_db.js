import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_iTCY9my1UjKt@ep-little-wind-ao1eh7ob-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function reset() {
  try {
    console.log("Truncating tables...");
    await pool.query('TRUNCATE TABLE notifikasi, pembayaran, reservasi, profil_penyewa, kamar, tipe_kamar RESTART IDENTITY CASCADE');

    console.log("Inserting tipe_kamar...");
    await pool.query(`
      INSERT INTO tipe_kamar (nama_tipe, harga_bulan, fasilitas) VALUES 
      ('Standard', 1500000, 'AC, Kasur, Lemari'),
      ('Premium', 2500000, 'AC, Kasur, Lemari, Kamar Mandi Dalam, TV');
    `);

    console.log("Inserting kamar...");
    await pool.query(`
      INSERT INTO kamar (tipe_id, nomor_kamar, lantai, status, foto_kamar) VALUES 
      (1, '101', 1, 'tersedia', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'),
      (1, '102', 1, 'tersedia', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'),
      (2, 'A-301', 3, 'tersedia', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800');
    `);

    console.log("Database reset complete.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

reset();
