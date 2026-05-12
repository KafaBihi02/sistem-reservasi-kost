import pembayaranModel from '../models/pembayaranModel.js';
import reservasiModel from '../models/reservasiModel.js';
import notifikasiService from './notifikasiService.js';
import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';

export const getAll = async () => {
    return await pembayaranModel.findAll();
};

export const create = async (userId, data) => {
    const { reservasi_id } = data;
    const reservasi = await reservasiModel.findById(reservasi_id);

    if (!reservasi) throw new AppError('Reservasi tidak ditemukan.', 404);
    if (reservasi.user_id !== userId) throw new AppError('Akses ditolak.', 403);

    return await pembayaranModel.create(data);
};

export const updateStatus = async (id, { status }) => {
    const pembayaran = await pembayaranModel.findById(id);
    if (!pembayaran) throw new AppError('Pembayaran tidak ditemukan.', 404);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const updated = await pembayaranModel.updateStatus(client, id, status);

        if (status === 'berhasil') {
            await client.query("UPDATE reservasi SET status = 'berjalan' WHERE reservasi_id = $1", [pembayaran.reservasi_id]);
        }

        await notifikasiService.create(client, {
            user_id: pembayaran.user_id,
            judul: `Pembayaran ${status.toUpperCase()}`,
            pesan: `Pembayaran Anda untuk reservasi #${pembayaran.reservasi_id} dinyatakan ${status}.`
        });

        await client.query('COMMIT');
        return updated;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export default { getAll, create, updateStatus };
