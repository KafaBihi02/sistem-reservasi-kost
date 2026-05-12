import db from '../config/db.js';

export const getStats = async () => {
    const [
        totalUsers,
        totalReservasi,
        totalPendapatan,
        kamarTersedia,
        pembayaranPending
    ] = await Promise.all([
        db.query(`SELECT COUNT(*) FROM users WHERE role = 'penyewa'`),
        db.query(`SELECT COUNT(*) FROM reservasi`),
        db.query(`SELECT COALESCE(SUM(jumlah_bayar), 0) AS total FROM pembayaran WHERE status = 'berhasil'`),
        db.query(`SELECT COUNT(*) FROM kamar WHERE status = 'tersedia' AND deleted_at IS NULL`),
        db.query(`SELECT COUNT(*) FROM pembayaran WHERE status = 'pending'`)
    ]);

    return {
        total_users: parseInt(totalUsers.rows[0].count),
        total_reservasi: parseInt(totalReservasi.rows[0].count),
        total_pendapatan: parseFloat(totalPendapatan.rows[0].total),
        kamar_tersedia: parseInt(kamarTersedia.rows[0].count),
        pembayaran_pending: parseInt(pembayaranPending.rows[0].count)
    };
};

export default { getStats };
