# Asismen_asramaIT
APLIKASI STORE
README Proyek Vue.js dengan Database Pendahuluan Proyek ini adalah aplikasi Vue.js
yang terhubung dengan database PostgreSQL. README ini memberikan panduan tentang cara
mengatur dan menjalankan proyek ini di lingkungan lokal Anda.
Prasyarat Pastikan Anda telah menginstal perangkat lunak berikut:
Node.js (versi terbaru) PostgreSQL (versi terbaru) Git (untuk mengkloning repositori)
Instalasi
1. Klon Repositori Klon repositori proyek ini ke komputer Anda:
bash Salin kode git clone https://github.com/username/nama-repositori.git cd namarepositori
2. Konfigurasi Database Buat Database:
Masuk ke PostgreSQL menggunakan command line atau tool GUI seperti pgAdmin. Buat
database baru dengan nama db_tokoh: sql Salin kode CREATE DATABASE db_tokoh;
Konfigurasi Environment:
Buat file .env di direktori root proyek dan tambahkan konfigurasi berikut: makefile
Salin kode DB_USERNAME=postgres DB_PASSWORD=ADMIN123 DB_NAME=db_tokoh
DB_HOST=localhost DB_PORT=5432 Jalankan Migrasi:
Pastikan Anda telah menginstal Sequelize CLI: bash Salin kode npm install -g
sequelize-cli Jalankan migrasi untuk membuat tabel yang diperlukan: bash Salin kode
sequelize db:migrate 3. Instalasi Dependensi Proyek Navigasi ke direktori proyek
Vue.js dan instal dependensi yang diperlukan: bash Salin kode npm install 4. Jalankan
Proyek Backend (Express.js): Pastikan Anda berada di direktori root proyek, kemudian
jalankan server Express.js: bash Salin kode npm run dev Frontend (Vue.js): Pindah ke
direktori client atau direktori tempat Anda menyimpan file Vue.js, lalu jalankan
aplikasi Vue.js: bash Salin kode npm run dev 5. Mengakses Aplikasi Buka browser dan
akses aplikasi di http://localhost:3001 untuk backend, dan http://localhost:5173 untuk
frontend (URL bisa berbeda tergantung konfigurasi). Fitur Utama CRUD Barang: Tambah,
edit, hapus, dan cari barang di database. Pagination: Memungkinkan tampilan barang
secara paginasi di halaman beranda. Kontribusi Jika Anda ingin berkontribusi pada
proyek ini, harap fork repositori ini, buat branch baru, dan kirimkan pull request.
Lisensi Proyek ini dilisensikan di bawah [Asrama It].