import kamarService from '../services/kamarService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
    const data = await kamarService.getAll();
    sendSuccess(res, data);
});

export const getTrashed = asyncHandler(async (req, res) => {
    const data = await kamarService.getTrashed();
    sendSuccess(res, data);
});

export const getById = asyncHandler(async (req, res) => {
    const data = await kamarService.getById(req.params.id);
    sendSuccess(res, data);
});

export const create = asyncHandler(async (req, res) => {
    const data = await kamarService.create(req.body);
    sendSuccess(res, data, 'Kamar berhasil ditambahkan.', 201);
});

export const update = asyncHandler(async (req, res) => {
    const data = await kamarService.update(req.params.id, req.body);
    sendSuccess(res, data, 'Kamar berhasil diupdate.');
});

export const softDelete = asyncHandler(async (req, res) => {
    await kamarService.softDelete(req.params.id);
    sendSuccess(res, null, 'Kamar berhasil dipindahkan ke trash.');
});

export const restore = asyncHandler(async (req, res) => {
    await kamarService.restore(req.params.id);
    sendSuccess(res, null, 'Kamar berhasil dipulihkan.');
});

export const hardDelete = asyncHandler(async (req, res) => {
    await kamarService.hardDelete(req.params.id);
    sendSuccess(res, null, 'Kamar berhasil dihapus permanen.');
});

export default { getAll, getTrashed, getById, create, update, softDelete, restore, hardDelete };
