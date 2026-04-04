-- ==============================================================
-- SQL SETUP: LOGIN RATE LIMITER (MAX 5 ATTEMPTS -> 15 MIN LOCK)
-- ==============================================================

-- 1. Buat tabel pencatat kesalahan login
CREATE TABLE IF NOT EXISTS public.login_attempts (
    email TEXT PRIMARY KEY,
    attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Mematikan RLS pada tabel ini agar Server Actions Next.js (Anon)
-- selalu bisa mengecek dan mem-blokir email yang coba masuk paksa.
-- Tabel ini murni untuk menahan laju serangan.
ALTER TABLE public.login_attempts DISABLE ROW LEVEL SECURITY;
