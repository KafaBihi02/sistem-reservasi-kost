import reservasiService from '../services/reservasiService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
    let data;
    if (req.session.user.role === 'admin') {
        data = await reservasiService.getAll();
    } else {
        data = await reservasiService.getByUser(req.session.user.id);
    }
    sendSuccess(res, data);
});

export const getById = asyncHandler(async (req, res) => {
    const data = await reservasiService.getById(req.params.id);
    sendSuccess(res, data);
});

export const create = asyncHandler(async (req, res) => {
    if (req.session.user.role === 'admin') {
        return res.status(403).json({ success: false, message: 'Admin tidak dapat melakukan reservasi.' });
    }
    const data = await reservasiService.create(req.session.user.id, req.body);
    sendSuccess(res, data, 'Reservasi berhasil diajukan.', 201);
});

export const updateStatus = asyncHandler(async (req, res) => {
    const data = await reservasiService.updateStatus(req.params.id, req.body);
    sendSuccess(res, data, 'Status reservasi berhasil diperbarui.');
});

export default { getAll, getById, create, updateStatus };
