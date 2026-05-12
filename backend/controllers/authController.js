import authService from '../services/authService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    // Simpan sesi setelah registrasi
    req.session.user = { id: user.user_id, email: user.email, role: user.role, nama: user.nama };
    sendSuccess(res, user, 'Registrasi berhasil.', 201);
});

export const login = asyncHandler(async (req, res) => {
    const user = await authService.login(req.body);
    // Simpan sesi
    req.session.user = { id: user.user_id, email: user.email, role: user.role, nama: user.nama };
    sendSuccess(res, user, 'Login berhasil.');
});

export const logout = asyncHandler(async (req, res) => {
    await new Promise((resolve, reject) => {
        req.session.destroy((err) => (err ? reject(err) : resolve()));
    });
    res.clearCookie('connect.sid');
    sendSuccess(res, null, 'Logout berhasil.');
});

export const getMe = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.session.user.id);
    sendSuccess(res, user);
});

export default { register, login, logout, getMe };

