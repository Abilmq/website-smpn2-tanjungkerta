-- ==========================================
-- TABEL LOGIN ATTEMPTS (Rate Limiting)
-- ==========================================
-- Mencatat percobaan login gagal per email
-- Max 5x gagal → lock akun 15 menit
-- Jalankan di Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    attempt_count INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan RLS
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Admin bisa melihat data login attempts (untuk monitoring)
CREATE POLICY "Admin bisa lihat login attempts"
    ON login_attempts FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy: Semua operasi INSERT/UPDATE diizinkan (karena diakses dari server action)
-- Server action menggunakan anon key, jadi perlu policy untuk INSERT dan UPDATE
CREATE POLICY "Server bisa insert login attempts"
    ON login_attempts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Server bisa update login attempts"
    ON login_attempts FOR UPDATE
    USING (true);
