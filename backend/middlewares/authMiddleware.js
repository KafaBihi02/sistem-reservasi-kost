import AppError from '../utils/AppError.js';

export const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return next(new AppError('Silakan login terlebih dahulu.', 401));
    }
    next();
};

export const requireAdmin = (req, res, next) => {
    console.log('requireAdmin check:', req.session?.user);
    if (!req.session.user) {
        return next(new AppError('Silakan login terlebih dahulu.', 401));
    }
    if (req.session.user.role !== 'admin') {
        return next(new AppError('Akses ditolak. Anda bukan admin.', 403));
    }
    next();
};
