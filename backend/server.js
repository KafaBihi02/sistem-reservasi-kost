import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import AppError from './utils/AppError.js';
import bcrypt from 'bcrypt';
import pool from './config/db.js';

// Routes imports
import authRoutes from './routes/authRoutes.js';
import tipeKamarRoutes from './routes/tipeKamarRoutes.js';
import kamarRoutes from './routes/kamarRoutes.js';
import reservasiRoutes from './routes/reservasiRoutes.js';
import pembayaranRoutes from './routes/pembayaranRoutes.js';
import notifikasiRoutes from './routes/notifikasiRoutes.js';
import { getDashboardStats } from './controllers/dashboardController.js';
import { requireAdmin } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware Global ─────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log HTTP requests
app.use((req, res, next) => {
    logger.http(req);
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_kost',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24  // 1 hari
    }
}));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tipe-kamar', tipeKamarRoutes);
app.use('/api/kamar', kamarRoutes);
app.use('/api/reservasi', reservasiRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/notifikasi', notifikasiRoutes);
app.get('/api/dashboard', requireAdmin, getDashboardStats);

app.get('/api/setup-admin', async (req, res) => {
    try {
        const hashedAdmin = await bcrypt.hash('admin123', 10);
        await pool.query("UPDATE users SET password = $1, role = 'admin' WHERE email = 'admin@kostku.com'", [hashedAdmin]);
        res.json({ success: true, message: "Admin setup complete" });
    } catch (e) {
        res.json({ success: false, error: e.toString() });
    }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Sistem Reservasi Kost API is running (ESM).' });
});

// ─── Handle undefined routes ──────────────────────────────────────────────────
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error(`${err.statusCode} - ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        logger.debug(err.stack);
    }

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    logger.info(`✅  Server berjalan di http://localhost:${PORT}`);
});
