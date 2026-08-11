# JarolivaTracking

## Setup Next.js, Prisma, dan PostgreSQL

1. Buat database PostgreSQL bernama `jaxlab`.
2. Salin `.env.example` menjadi `.env`, kemudian sesuaikan `DATABASE_URL` dan `JWT_SECRET`.
3. Untuk database baru, buat tabel dengan `npm run db:migrate -- --name init`.
4. Jika database berasal dari versi lama dan tabelnya sudah ada, tandai migration awal dengan `npm run db:baseline` (cukup sekali).
5. Generate Prisma Client dengan `npm run db:generate`.
6. Jalankan frontend dan backend dengan `npm run dev`.

Frontend Next.js: `http://localhost:3000`

API: `http://localhost:3001`

PostgreSQL menyimpan akun, sesi FF72, check-in, poin, dan catatan gula darah per pengguna melalui Prisma ORM.

Migration production dijalankan dengan `npm run db:deploy`. Prisma Studio tersedia melalui `npm run db:studio`.
