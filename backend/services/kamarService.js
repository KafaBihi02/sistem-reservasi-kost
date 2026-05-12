import kamarModel from '../models/kamarModel.js';
import AppError from '../utils/AppError.js';

export const getAll = async () => {
    return await kamarModel.findAll();
};

export const getTrashed = async () => {
    return await kamarModel.findAllTrashed();
};

export const getById = async (id) => {
    const data = await kamarModel.findById(id);
    if (!data) throw new AppError('Kamar tidak ditemukan.', 404);
    return data;
};

export const create = async (data) => {
    return await kamarModel.create(data);
};

export const update = async (id, data) => {
    const updated = await kamarModel.update(id, data);
    if (!updated) throw new AppError('Kamar tidak ditemukan.', 404);
    return updated;
};

export const softDelete = async (id) => {
    await kamarModel.softDelete(id);
};

export const restore = async (id) => {
    await kamarModel.restore(id);
};

export const hardDelete = async (id) => {
    await kamarModel.hardDelete(id);
};

export default { getAll, getTrashed, getById, create, update, softDelete, restore, hardDelete };
