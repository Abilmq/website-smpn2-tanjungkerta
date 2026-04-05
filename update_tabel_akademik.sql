-- Jalankan script ini di Supabase SQL Editor
-- Untuk memperbarui struktur tabel akademik agar mendukung penyimpanan kalender akademik dan jadwal pelajaran.

ALTER TABLE akademik RENAME COLUMN kalender_pdf_url TO kalender_akademik_url;
ALTER TABLE akademik ADD COLUMN IF NOT EXISTS jadwal_pelajaran_url TEXT;
