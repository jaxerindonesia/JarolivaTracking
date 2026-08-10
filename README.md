# JarolivaTracking

## Setup PostgreSQL dan login

1. Buat database PostgreSQL bernama `jaxlab`.
2. Salin `.env.example` menjadi `.env`, kemudian sesuaikan `DATABASE_URL` dan `JWT_SECRET`.
3. Buat seluruh tabel dengan `npm run db:migrate`.
4. Jalankan frontend dan backend dengan `npm run dev`.

Frontend: `http://localhost:5173`

API: `http://localhost:3001`

PostgreSQL menyimpan akun, sesi FF72, check-in, poin, dan catatan gula darah per pengguna.
