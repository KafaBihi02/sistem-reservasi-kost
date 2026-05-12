-- Drop tables if they exist
DROP TABLE IF EXISTS notifikasi CASCADE;
DROP TABLE IF EXISTS pembayaran CASCADE;
DROP TABLE IF EXISTS reservasi CASCADE;
DROP TABLE IF EXISTS kamar CASCADE;
DROP TABLE IF EXISTS tipe_kamar CASCADE;
DROP TABLE IF EXISTS profil_penyewa CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'penyewa', -- 'admin' or 'penyewa'
    status VARCHAR(20) DEFAULT 'aktif', -- 'aktif' or 'non-aktif'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profil Penyewa table
CREATE TABLE profil_penyewa (
    profil_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20)
);

-- Tipe Kamar table
CREATE TABLE tipe_kamar (
    tipe_id SERIAL PRIMARY KEY,
    nama_tipe VARCHAR(100) NOT NULL,
    harga_bulan DECIMAL(12, 2) NOT NULL,
    fasilitas TEXT -- Comma separated or JSON
);

-- Kamar table
CREATE TABLE kamar (
    kamar_id SERIAL PRIMARY KEY,
    tipe_id INT REFERENCES tipe_kamar(tipe_id) ON DELETE SET NULL,
    nomor_kamar VARCHAR(20) UNIQUE NOT NULL,
    lantai INT,
    status VARCHAR(20) DEFAULT 'tersedia', -- 'tersedia', 'terisi', 'perbaikan'
    foto_kamar TEXT
);

-- Reservasi table
CREATE TABLE reservasi (
    reservasi_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    kamar_id INT REFERENCES kamar(kamar_id) ON DELETE CASCADE,
    tanggal_masuk DATE NOT NULL,
    tanggal_keluar DATE NOT NULL,
    total_harga DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'menunggu', -- 'menunggu', 'dikonfirmasi', 'berjalan', 'selesai', 'dibatalkan'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pembayaran table
CREATE TABLE pembayaran (
    pembayaran_id SERIAL PRIMARY KEY,
    reservasi_id INT REFERENCES reservasi(reservasi_id) ON DELETE CASCADE,
    jumlah_bayar DECIMAL(12, 2) NOT NULL,
    metode_bayar VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'berhasil', 'gagal'
    tanggal_bayar TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifikasi table
CREATE TABLE notifikasi (
    notifikasi_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    judul VARCHAR(255) NOT NULL,
    pesan TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO users (email, password, role, status) VALUES 
('admin@kost.com', '$2b$10$YourHashedPasswordHere', 'admin', 'aktif'),
('user@example.com', '$2b$10$YourHashedPasswordHere', 'penyewa', 'aktif');

INSERT INTO profil_penyewa (user_id, nama, no_hp) VALUES 
(1, 'Admin Kost', '08123456789'),
(2, 'Budi Santoso', '08987654321');

INSERT INTO tipe_kamar (nama_tipe, harga_bulan, fasilitas) VALUES 
('Standard', 1500000, 'AC, Kasur, Lemari'),
('Deluxe', 2500000, 'AC, Kasur, Lemari, Kamar Mandi Dalam, TV');

INSERT INTO kamar (tipe_id, nomor_kamar, lantai, status, foto_kamar) VALUES 
(1, '101', 1, 'tersedia', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'),
(1, '102', 1, 'tersedia', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'),
(2, '201', 2, 'tersedia', 'https://images.unsplash.com/photo-1536376074432-c6258d241bb3');
