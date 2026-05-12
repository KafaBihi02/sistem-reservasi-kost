import reservasiModel from '../models/reservasiModel.js';
import kamarModel from '../models/kamarModel.js';
import notifikasiService from './notifikasiService.js';
import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';

export const getAll = async () => {
    return await reservasiModel.findAll();
};

export const getByUser = async (userId) => {
    return await reservasiModel.findAllByUser(userId);
};

export const getById = async (id) => {
    const data = await reservasiModel.findById(id);
    if (!data) throw new AppError('Reservasi tidak ditemukan.', 404);
    return data;
};

export const create = async (userId, data) => {
    const { kamar_id, tanggal_masuk, tanggal_keluar } = data;

    const kamar = await kamarModel.findById(kamar_id);
    if (!kamar) throw new AppError('Kamar tidak ditemukan.', 404);
    if (kamar.status !== 'tersedia') throw new AppError('Kamar tidak tersedia.', 400);

    const isBentrok = await reservasiModel.findKonflikTanggal(kamar_id, tanggal_masuk, tanggal_keluar);
    if (isBentrok) throw new AppError('Kamar sudah dipesan pada tanggal tersebut.', 400);

    const tMasuk = new Date(tanggal_masuk);
    const tKeluar = new Date(tanggal_keluar);
    const selisihHari = Math.ceil((tKeluar - tMasuk) / (1000 * 60 * 60 * 24));
    if (selisihHari <= 0) throw new AppError('Tanggal keluar harus setelah tanggal masuk.', 400);
    if (selisihHari < 30) throw new AppError('Minimal penyewaan adalah 30 hari (1 bulan).', 400);

    // Flat per bulan: pembulatan ke atas (31 hari = 2 bulan, 30 hari = 1 bulan)
    const jumlahBulan = Math.ceil(selisihHari / 30);
    const totalHarga = jumlahBulan * parseFloat(kamar.harga_bulan);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const newReservasi = await reservasiModel.create(client, {
            user_id: userId,
            kamar_id,
            tanggal_masuk,
            tanggal_keluar,
            total_harga: totalHarga
        });

        await client.query("UPDATE kamar SET status = 'dipesan' WHERE kamar_id = $1", [kamar_id]);
        
        await notifikasiService.create(client, {
            user_id: userId,
            judul: 'Reservasi Berhasil',
            pesan: `Reservasi kamar ${kamar.nomor_kamar} telah diajukan. Silakan lakukan pembayaran.`
        });

        await client.query('COMMIT');
        return newReservasi;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const updateStatus = async (id, { status }) => {
    const reservasi = await reservasiModel.findById(id);
    if (!reservasi) throw new AppError('Reservasi tidak ditemukan.', 404);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const updated = await reservasiModel.updateStatus(client, id, status);

        if (status === 'dikonfirmasi') {
            await client.query("UPDATE kamar SET status = 'dipesan' WHERE kamar_id = $1", [reservasi.kamar_id]);
        } else if (status === 'dibatalkan' || status === 'selesai' || status === 'ditolak') {
            await client.query("UPDATE kamar SET status = 'tersedia' WHERE kamar_id = $1", [reservasi.kamar_id]);
        }

        await notifikasiService.create(client, {
            user_id: reservasi.user_id,
            judul: `Reservasi ${status.toUpperCase()}`,
            pesan: `Status reservasi kamar ${reservasi.nomor_kamar} Anda kini menjadi ${status}.`
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

export default { getAll, getByUser, getById, create, updateStatus };
