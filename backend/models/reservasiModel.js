import db from '../config/db.js';

export const findAll = async () => {
    const result = await db.query(
        `SELECT r.*,
                u.email, p.nama AS nama_penyewa, p.no_hp,
                k.nomor_kamar, k.lantai,
                t.nama_tipe, t.harga_bulan
         FROM reservasi r
         JOIN users u ON r.user_id = u.user_id
         LEFT JOIN profil_penyewa p ON r.user_id = p.user_id
         JOIN kamar k ON r.kamar_id = k.kamar_id
         LEFT JOIN tipe_kamar t ON k.tipe_id = t.tipe_id
         ORDER BY r.created_at DESC`
    );
    return result.rows;
};

export const findAllByUser = async (userId) => {
    const result = await db.query(
        `SELECT r.*,
                k.nomor_kamar, k.lantai, k.foto_kamar,
                t.nama_tipe, t.harga_bulan, t.fasilitas,
                pb.status AS status_pembayaran
         FROM reservasi r
         JOIN kamar k ON r.kamar_id = k.kamar_id
         LEFT JOIN tipe_kamar t ON k.tipe_id = t.tipe_id
         LEFT JOIN pembayaran pb ON r.reservasi_id = pb.reservasi_id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC`,
        [userId]
    );
    return result.rows;
};

export const findById = async (id) => {
    const result = await db.query(
        `SELECT r.*,
                u.email, p.nama AS nama_penyewa, p.no_hp,
                k.nomor_kamar, k.lantai, k.foto_kamar,
                t.nama_tipe, t.harga_bulan, t.fasilitas
         FROM reservasi r
         JOIN users u ON r.user_id = u.user_id
         LEFT JOIN profil_penyewa p ON r.user_id = p.user_id
         JOIN kamar k ON r.kamar_id = k.kamar_id
         LEFT JOIN tipe_kamar t ON k.tipe_id = t.tipe_id
         WHERE r.reservasi_id = $1`,
        [id]
    );
    return result.rows[0] || null;
};

export const create = async (client, { user_id, kamar_id, tanggal_masuk, tanggal_keluar, total_harga }) => {
    const result = await client.query(
        `INSERT INTO reservasi (user_id, kamar_id, tanggal_masuk, tanggal_keluar, total_harga, status)
         VALUES ($1, $2, $3, $4, $5, 'menunggu')
         RETURNING *`,
        [user_id, kamar_id, tanggal_masuk, tanggal_keluar, total_harga]
    );
    return result.rows[0];
};

export const updateStatus = async (client, id, status) => {
    const result = await client.query(
        `UPDATE reservasi SET status = $1 WHERE reservasi_id = $2 RETURNING *`,
        [status, id]
    );
    return result.rows[0] || null;
};

export const findKonflikTanggal = async (kamar_id, tanggal_masuk, tanggal_keluar) => {
    const result = await db.query(
        `SELECT reservasi_id FROM reservasi
         WHERE kamar_id = $1
           AND status IN ('dikonfirmasi', 'berjalan')
           AND NOT ($3 <= tanggal_masuk OR $2 >= tanggal_keluar)`,
        [kamar_id, tanggal_masuk, tanggal_keluar]
    );
    return result.rows.length > 0;
};

export default { findAll, findAllByUser, findById, create, updateStatus, findKonflikTanggal };
