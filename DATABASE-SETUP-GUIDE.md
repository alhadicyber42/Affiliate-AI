# 🗄️ Database Setup Guide - WAJIB DIBACA!

## ⚠️ ERROR: "Could not find the 'category' column"

Jika Anda mendapat error ini, berarti **database belum di-setup**. Ikuti langkah berikut:

---

## 📋 Langkah Setup Database (5 Menit)

### 1️⃣ Buka Supabase Dashboard

1. Buka browser, kunjungi: https://supabase.com
2. Login dengan akun Anda
3. Pilih project: **xufgwfnrmqijshgoihot**

### 2️⃣ Buka SQL Editor

1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik tombol **"New Query"** (hijau, pojok kanan atas)

### 3️⃣ Jalankan Schema SQL

**PILIHAN A: Install Baru (Recommended)**

1. Buka file: `backend/database/schema.sql`
2. Copy **SEMUA** isi file (Ctrl+A, Ctrl+C)
3. Paste ke SQL Editor di Supabase
4. Klik tombol **"Run"** (atau tekan Ctrl+Enter)
5. Tunggu sampai muncul pesan sukses

**PILIHAN B: Reset Database (Jika sudah ada tabel)**

1. Buka file: `backend/database/reset-schema.sql`
2. Copy semua isi file
3. Paste ke SQL Editor
4. Klik **"Run"**
5. Tunggu selesai
6. Ulangi langkah di **PILIHAN A**

### 4️⃣ Verifikasi Setup

1. Di sidebar kiri, klik **"Table Editor"**
2. Pastikan Anda melihat tabel-tabel ini:
   - ✅ profiles
   - ✅ products
   - ✅ scripts
   - ✅ script_modules
   - ✅ videos
   - ✅ analytics
   - ✅ ab_tests
   - ✅ ab_test_variants

3. Klik salah satu tabel (misal: **products**)
4. Klik tab **"Policies"**
5. Pastikan ada 4 policies: SELECT, INSERT, UPDATE, DELETE

### 5️⃣ Restart Backend

Setelah database setup:

```bash
# Stop backend (Ctrl+C di terminal backend)
# Lalu jalankan lagi:
cd backend
node index.js
```

### 6️⃣ Test Aplikasi

1. Buka aplikasi: http://localhost:5173
2. **PENTING:** Logout dulu jika sudah login
3. Register akun baru (atau login dengan akun lama)
4. Coba extract product
5. Seharusnya berhasil! ✅

---

## 🔧 Troubleshooting

### Error: "relation 'products' already exists"

**Solusi:** Tabel sudah ada tapi struktur salah.

1. Jalankan `backend/database/reset-schema.sql`
2. Lalu jalankan `backend/database/schema.sql`

### Error: "Cannot coerce the result to a single JSON object"

**Solusi:** Ada duplikat profile.

1. Buka Table Editor > profiles
2. Hapus profile yang duplikat
3. Atau jalankan:
```sql
DELETE FROM profiles 
WHERE id NOT IN (
  SELECT DISTINCT ON (email) id 
  FROM profiles
);
```

### Error: "permission denied for table products"

**Solusi:** RLS policies belum dibuat.

1. Jalankan ulang bagian RLS dari `schema.sql`
2. Atau jalankan `quick-fix.sql` untuk cek status

### Profile tidak otomatis dibuat saat register

**Solusi:** Trigger belum dibuat.

1. Cek trigger dengan query:
```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

2. Jika tidak ada, jalankan ulang `schema.sql`

3. Atau buat profile manual:
```sql
INSERT INTO profiles (id, email, name, plan, credits)
SELECT 
  id, email, 
  split_part(email, '@', 1),
  'free', 100
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
```

---

## ✅ Checklist Setup

Gunakan checklist ini untuk memastikan setup benar:

- [ ] Supabase dashboard terbuka
- [ ] SQL Editor terbuka
- [ ] File `schema.sql` sudah di-copy
- [ ] Query sudah di-run (klik "Run")
- [ ] Muncul pesan sukses (tidak ada error merah)
- [ ] 8 tabel terlihat di Table Editor
- [ ] RLS policies ada di setiap tabel
- [ ] Backend sudah di-restart
- [ ] Browser cache/localStorage sudah di-clear
- [ ] Test register akun baru
- [ ] Test extract product
- [ ] Data muncul di tabel products

---

## 🆘 Masih Error?

Jalankan diagnostic script:

1. Buka SQL Editor
2. Copy isi file `backend/database/quick-fix.sql`
3. Paste dan Run
4. Screenshot hasilnya
5. Share screenshot untuk debugging

---

## 📞 Need Help?

Jika masih ada masalah:
1. Screenshot error message
2. Screenshot Table Editor (list tabel)
3. Screenshot hasil `quick-fix.sql`
4. Buka GitHub Issues

---

**INGAT:** Database setup hanya perlu dilakukan **SEKALI**. Setelah setup, data akan tersimpan permanen di Supabase.
