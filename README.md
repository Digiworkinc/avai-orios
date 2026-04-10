# AVAI-ORIOS - Smart Technology System Integrator

Aplikasi web AVAI-ORIOS adalah platform integrasi teknologi cerdas yang dilengkapi dengan Admin Dashboard untuk manajemen konten secara real-time menggunakan Firebase.

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)
- [npm](https://www.npmjs.com/) (Biasanya terinstal bersama Node.js)

## Langkah Instalasi Lokal

Jika Anda mengekspor kode ini dari AI Studio, ikuti langkah-langkah berikut:

1. **Ekstrak File**: Ekstrak file ZIP yang diunduh ke folder proyek Anda.
2. **Buka Terminal**: Masuk ke direktori proyek tersebut.
3. **Instal Dependensi**:
   ```bash
   npm install
   ```
4. **Konfigurasi Firebase**:
   - Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
   - Aktifkan **Authentication** (Google Provider).
   - Aktifkan **Cloud Firestore**.
   - Salin konfigurasi Firebase Anda ke file `src/firebase-applet-config.json` (atau sesuaikan di `src/firebase.ts`).
5. **Jalankan Server Pengembangan**:
   ```bash
   npm run dev
   ```
6. **Akses Aplikasi**: Buka browser dan akses `http://localhost:3000`.

## Panduan Deploy ke GitHub Pages

Berikut adalah langkah-langkah detail untuk meng-hosting aplikasi AVAI-ORIOS di GitHub Pages:

### 1. Persiapan di GitHub
1. Buat repositori baru di GitHub (misal: `avai-orios-web`).
2. Masuk ke **Settings** > **Pages** di repositori tersebut.
3. Pada bagian **Build and deployment**, pastikan Source diatur ke **"Deploy from a branch"**.

### 2. Konfigurasi Kode
Saya telah menyiapkan konfigurasi yang diperlukan. Jika Anda melakukannya secara manual:
1. Instal package `gh-pages`:
   ```bash
   npm install gh-pages --save-dev
   ```
2. Pastikan `vite.config.ts` memiliki properti `base`. Jika URL Anda adalah `https://username.github.io/avai-orios-web/`, maka `base` harus diatur ke `/avai-orios-web/`.
   - Di proyek ini, Anda bisa mengaturnya via environment variable `VITE_BASE_PATH`.

### 3. Langkah Deployment
1. Buka terminal di folder proyek Anda.
2. Jalankan perintah deploy:
   ```bash
   npm run deploy
   ```
   *Perintah ini akan otomatis menjalankan `build` dan mengunggah folder `dist` ke branch `gh-pages` di GitHub.*

### 4. Aktivasi di GitHub
1. Kembali ke repositori GitHub Anda > **Settings** > **Pages**.
2. Di bawah **Branch**, pilih `gh-pages` dan folder `/(root)`.
3. Klik **Save**.
4. Tunggu beberapa menit, website Anda akan aktif di URL yang disediakan oleh GitHub.

### 5. Konfigurasi Firebase (PENTING)
Agar fitur Login Google dan Database tetap berfungsi di GitHub Pages:
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Pilih proyek Anda > **Authentication** > **Settings** > **Authorized Domains**.
3. Klik **Add Domain** dan masukkan domain GitHub Pages Anda (misal: `username.github.io`).
4. Tanpa langkah ini, Login Google akan ditolak karena domain tidak dikenal.

## Struktur Proyek

- `src/App.tsx`: Komponen utama dan logika routing/autentikasi.
- `src/components/Landing.tsx`: Komponen untuk halaman depan (Landing Page).
- `src/components/AdminDashboard.tsx`: Panel kontrol untuk mengedit konten.
- `src/firebase.ts`: Konfigurasi dan inisialisasi Firebase.
- `firestore.rules`: Aturan keamanan untuk database Firestore.

## Teknologi yang Digunakan

- **Frontend**: React 19, Vite, Tailwind CSS.
- **Backend/Database**: Firebase Firestore.
- **Autentikasi**: Firebase Auth (Google Login).
- **Animasi**: Motion (Framer Motion).
- **Ikon**: Lucide React.

## Catatan Keamanan

Pastikan Anda telah mengunggah `firestore.rules` ke Firebase Console Anda untuk memastikan hanya Admin yang dapat mengubah konten website.
