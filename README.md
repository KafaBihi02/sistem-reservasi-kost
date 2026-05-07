# Sistem Reservasi Kost

Aplikasi web untuk mengelola reservasi kamar kost, pembayaran, dan tracking status reservasi secara real-time.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Folder](#-struktur-folder)
- [API Endpoints](#-api-endpoints)
- [User Flow](#-user-flow)
- [Database Schema](#-database-schema)

---

## ✨ Fitur Utama

### Untuk Penyewa
- ✅ Registrasi dan login pengguna
- ✅ Melihat daftar tipe kamar dan kamar tersedia
- ✅ Melihat detail kamar dan harga
- ✅ Mengajukan reservasi kamar dengan tanggal custom
- ✅ Tracking status reservasi (pending, dikonfirmasi, berjalan, selesai, dibatalkan)
- ✅ Upload bukti pembayaran
- ✅ Tracking status pembayaran
- ✅ Menerima notifikasi untuk perubahan status
- ✅ Melihat notifikasi yang sudah dibaca dan belum

### Untuk Admin
- ✅ Mengelola tipe kamar (CRUD)
- ✅ Mengelola data kamar (CRUD)
- ✅ Melihat semua reservasi dengan status
- ✅ Mengonfirmasi atau menolak reservasi
- ✅ Melihat semua pembayaran
- ✅ Memverifikasi dan mengubah status pembayaran
- ✅ Melihat dashboard statistik sistem

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: Session-based (express-session)
- **Password Hashing**: bcrypt
- **Environment**: dotenv
- **Dev Tools**: Nodemon

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Linting**: ESLint

---

## 📦 Prasyarat

Pastikan sudah terinstall:
- Node.js v18+ dan npm
- PostgreSQL v12+
- Git (opsional)

---

## ⚙️ Instalasi

### 1. Clone atau Download Repository

```bash
git clone <repository-url>
cd sistem-reservasi-kost-main
```

### 2. Setup Backend

```bash
cd backend
npm install
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

---

## 🔧 Konfigurasi

### Backend - File `.env`

Buat file `.env` di folder `backend/` dengan isi:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/kost_db

# Server
PORT=5000
NODE_ENV=development

# Session
SESSION_SECRET=your_secret_key_here

# Frontend
CLIENT_URL=http://localhost:5173
```

### Frontend - Konfigurasi Axios

Pastikan base URL di file frontend mengarah ke backend:

```javascript
// src/api/axios.js atau di tempat setting axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export default api;
```

---

## 🚀 Menjalankan Aplikasi

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

---

## 📁 Struktur Folder

```
sistem-reservasi-kost-main/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Konfigurasi database PostgreSQL
│   │
│   ├── controllers/
│   │   ├── authController.js     # Logik register, login, logout
│   │   ├── kamarController.js    # Logik CRUD kamar
│   │   ├── tipeKamarController.js # Logik CRUD tipe kamar
│   │   ├── reservasiController.js # Logik reservasi
│   │   ├── pembayaranController.js # Logik pembayaran
│   │   ├── notifikasiController.js # Logik notifikasi
│   │   └── dashboardController.js  # Logik dashboard stats
│   │
│   ├── models/
│   │   ├── userModel.js           # Query user
│   │   ├── kamarModel.js          # Query kamar
│   │   ├── tipeKamarModel.js      # Query tipe kamar
│   │   ├── reservasiModel.js      # Query reservasi
│   │   ├── pembayaranModel.js     # Query pembayaran
│   │   ├── notifikasiModel.js     # Query notifikasi
│   │   └── dashboardModel.js      # Query dashboard
│   │
│   ├── services/
│   │   ├── authService.js        # Business logic auth
│   │   ├── kamarService.js       # Business logic kamar
│   │   ├── tipeKamarService.js   # Business logic tipe kamar
│   │   ├── reservasiService.js   # Business logic reservasi
│   │   ├── pembayaranService.js  # Business logic pembayaran
│   │   ├── notifikasiService.js  # Business logic notifikasi
│   │   └── dashboardService.js   # Business logic dashboard
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # Endpoint autentikasi
│   │   ├── kamarRoutes.js       # Endpoint kamar
│   │   ├── tipeKamarRoutes.js   # Endpoint tipe kamar
│   │   ├── reservasiRoutes.js   # Endpoint reservasi
│   │   ├── pembayaranRoutes.js  # Endpoint pembayaran
│   │   └── notifikasiRoutes.js  # Endpoint notifikasi
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js     # Middleware autentikasi & otorisasi
│   │
│   ├── utils/
│   │   ├── AppError.js           # Custom error handler
│   │   ├── asyncHandler.js       # Wrapper untuk async functions
│   │   ├── logger.js             # Logging utility
│   │   └── response.js           # Format response standard
│   │
│   ├── server.js                 # Entry point backend
│   ├── package.json              # Dependencies backend
│   └── .env                       # Environment variables (tidak di-commit)
│
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Halaman-halaman aplikasi
│   │   ├── App.jsx               # Root component
│   │   ├── main.jsx              # Entry point frontend
│   │   ├── App.css               # Global styles
│   │   └── index.css             # Base styles
│   │
│   ├── public/                   # Static files
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Konfigurasi Vite
│   ├── eslint.config.js          # Konfigurasi ESLint
│   ├── package.json              # Dependencies frontend
│   └── README.md                 # Dokumentasi frontend
│
└── README.md                     # File ini
```

---

## 🔌 API Endpoints

### Autentikasi
```
POST   /api/auth/register        # Registrasi pengguna
POST   /api/auth/login           # Login pengguna
POST   /api/auth/logout          # Logout pengguna (memerlukan auth)
GET    /api/auth/me              # Ambil data user saat ini (memerlukan auth)
```

### Tipe Kamar
```
GET    /api/tipe-kamar           # Ambil semua tipe kamar
GET    /api/tipe-kamar/:id       # Ambil detail tipe kamar
POST   /api/tipe-kamar           # Buat tipe kamar (admin only)
PUT    /api/tipe-kamar/:id       # Update tipe kamar (admin only)
DELETE /api/tipe-kamar/:id       # Hapus tipe kamar (admin only)
```

### Kamar
```
GET    /api/kamar                # Ambil semua kamar
GET    /api/kamar/:id            # Ambil detail kamar
POST   /api/kamar                # Buat kamar (admin only)
PUT    /api/kamar/:id            # Update kamar (admin only)
DELETE /api/kamar/:id            # Hapus kamar (admin only)
```

### Reservasi
```
GET    /api/reservasi            # Ambil reservasi (admin: semua, user: milik user)
GET    /api/reservasi/:id        # Ambil detail reservasi (memerlukan auth)
POST   /api/reservasi            # Buat reservasi (memerlukan auth)
PUT    /api/reservasi/:id/status # Update status reservasi (admin only)
```

### Pembayaran
```
GET    /api/pembayaran           # Ambil data pembayaran (memerlukan auth)
POST   /api/pembayaran           # Buat pembayaran (memerlukan auth)
PUT    /api/pembayaran/:id/status # Update status pembayaran (admin only)
```

### Notifikasi
```
GET    /api/notifikasi           # Ambil notifikasi user (memerlukan auth)
PUT    /api/notifikasi/:id/read  # Tandai notifikasi dibaca (memerlukan auth)
PUT    /api/notifikasi/read-all  # Tandai semua notifikasi dibaca (memerlukan auth)
```

### Dashboard
```
GET    /api/dashboard            # Ambil statistik dashboard (admin only)
```

---

## 👥 User Flow

### Flow Penyewa

1. **Register & Login**
   - Penyewa mendaftar dengan email, password, nama, dan no HP
   - Login dengan email dan password
   - Session disimpan di server

2. **Browsing Kamar**
   - Lihat daftar tipe kamar
   - Lihat daftar kamar dengan status dan harga
   - Lihat detail kamar

3. **Membuat Reservasi**
   - Pilih kamar yang tersedia
   - Tentukan tanggal masuk dan keluar
   - Sistem otomatis menghitung total harga
   - Ajukan reservasi (status: "pending")
   - Menerima notifikasi

4. **Proses Pembayaran**
   - Upload bukti pembayaran
   - Notifikasi dikirim ke user
   - Admin verifikasi pembayaran
   - Jika disetujui, status reservasi berubah ke "berjalan"

5. **Tracking Status**
   - User dapat melihat status reservasi
   - Melihat status pembayaran
   - Menerima notifikasi untuk setiap perubahan status
   - Menandai notifikasi sudah dibaca

### Flow Admin

1. **Login**
   - Admin login dengan akun admin
   - Mendapat akses ke semua fitur management

2. **Manajemen Tipe Kamar**
   - Membuat tipe kamar baru
   - Edit tipe kamar
   - Hapus tipe kamar

3. **Manajemen Kamar**
   - Menambah kamar baru
   - Edit data kamar
   - Hapus kamar

4. **Manajemen Reservasi**
   - Lihat semua reservasi dari user
   - Mengonfirmasi reservasi (status: "dikonfirmasi")
   - Menolak reservasi (status: "dibatalkan")
   - Tracking status: pending → dikonfirmasi → berjalan → selesai

5. **Manajemen Pembayaran**
   - Lihat semua bukti pembayaran dari user
   - Verifikasi pembayaran (status: "sukses" atau "ditolak")
   - Saat pembayaran sukses, status reservasi berubah ke "berjalan"

6. **Dashboard**
   - Lihat statistik sistem (total kamar, reservasi, pembayaran, dll)

---

## 🗄️ Database Schema (Ringkas)

### Tabel Users
```sql
- user_id (PK)
- email (UNIQUE)
- password (hashed)
- role (enum: 'admin', 'penyewa')
- status (enum: 'aktif', 'nonaktif')
- created_at
```

### Tabel Profil Penyewa
```sql
- profil_id (PK)
- user_id (FK)
- nama
- no_hp
```

### Tabel Tipe Kamar
```sql
- tipe_kamar_id (PK)
- nama_tipe
- deskripsi
- fasilitas
```

### Tabel Kamar
```sql
- kamar_id (PK)
- tipe_kamar_id (FK)
- nomor_kamar (UNIQUE)
- harga_bulan
- status (enum: 'tersedia', 'dipesan', 'maintenance')
```

### Tabel Reservasi
```sql
- reservasi_id (PK)
- user_id (FK)
- kamar_id (FK)
- tanggal_masuk
- tanggal_keluar
- total_harga
- status (enum: 'pending', 'dikonfirmasi', 'berjalan', 'selesai', 'dibatalkan')
- created_at
```

### Tabel Pembayaran
```sql
- pembayaran_id (PK)
- user_id (FK)
- reservasi_id (FK)
- jumlah_dibayar
- bukti_pembayaran (file/path)
- status (enum: 'pending', 'sukses', 'ditolak')
- created_at
```

### Tabel Notifikasi
```sql
- notifikasi_id (PK)
- user_id (FK)
- judul
- pesan
- is_read
- created_at
```

---

## 🔐 Keamanan

- Password di-hash menggunakan bcrypt sebelum disimpan
- Session-based authentication dengan httpOnly cookie
- CORS dikonfigurasi untuk menerima request hanya dari frontend
- Middleware autentikasi melindungi rute sensitif
- Role-based access control (admin vs penyewa)
- Transaksi database untuk memastikan data consistency

---

## 📝 Catatan

### Fitur yang Bisa Ditambahkan di Masa Depan
- Email verification saat register
- Reset password via email
- Riwayat checkout/check-in guest
- Rating dan review kamar
- Payment gateway integration (Midtrans, Stripe, dll)
- SMS notification
- Export laporan pembayaran ke PDF
- Multi-user admin dengan permission levels
- Real-time chat antara admin dan penyewa

---

## 📄 Lisensi

Project ini dibuat untuk Tugas Akhir Praktikum Sistem Basis Data.

---

**Last Updated**: Mei 2026
