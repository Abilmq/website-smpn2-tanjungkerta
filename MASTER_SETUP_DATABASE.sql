-- ============================================================
-- MASTER SETUP SQL - WEBSITE SMPN 2 TANJUNGKERTA
-- ============================================================
-- File ini menggabungkan SELURUH script SQL yang dibutuhkan.
-- Cukup jalankan SEKALI di Supabase SQL Editor.
--
-- URUTAN EKSEKUSI:
--   1. EKSTENSI & TABEL UTAMA (dari supabase_schema.sql)
--   2. TABEL TAMBAHAN (komentar, kontak, login_attempts)
--   3. ALTER TABLE (perubahan kolom yang dibutuhkan)
--   4. RLS POLICIES (semua kebijakan keamanan)
--   5. STORAGE POLICIES (izin upload/delete file)
--   6. DATA AWAL (seeding default)
-- ============================================================


-- ============================================================
-- BAGIAN 1: EKSTENSI
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- BAGIAN 2: TABEL UTAMA
-- ============================================================

-- Tabel Admin
CREATE TABLE IF NOT EXISTS public.admin (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Profil Sekolah (Single Row)
CREATE TABLE IF NOT EXISTS public.profil_sekolah (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_sekolah TEXT NOT NULL DEFAULT 'SMP Negeri 2 Tanjungkerta',
    npsn TEXT NOT NULL DEFAULT '-',
    sejarah TEXT,
    visi TEXT,
    misi TEXT,
    struktur_organisasi_url TEXT,
    sambutan_kepsek TEXT,
    foto_kepsek TEXT,
    nama_kepsek TEXT,
    jumlah_siswa INTEGER DEFAULT 0,
    jumlah_guru INTEGER DEFAULT 0,
    jumlah_ekskul INTEGER DEFAULT 0,
    alamat TEXT,
    telepon TEXT,
    email TEXT,
    maps_url TEXT,
    jam_operasional TEXT,
    instagram TEXT,
    facebook TEXT,
    youtube TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Berita
CREATE TABLE IF NOT EXISTS public.berita (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    konten TEXT NOT NULL,
    kategori TEXT NOT NULL DEFAULT 'Umum',
    thumbnail_url TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    admin_id UUID REFERENCES public.admin(id) ON DELETE SET NULL
);

-- Tabel Pengumuman
CREATE TABLE IF NOT EXISTS public.pengumuman (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    konten TEXT NOT NULL,
    tanggal_berlaku DATE NOT NULL,
    featured BOOLEAN DEFAULT false,
    aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    admin_id UUID REFERENCES public.admin(id) ON DELETE SET NULL
);

-- Tabel Galeri
CREATE TABLE IF NOT EXISTS public.galeri (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    deskripsi TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image',
    kategori TEXT NOT NULL DEFAULT 'Kegiatan',
    tanggal_kegiatan DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Guru & Tendik
CREATE TABLE IF NOT EXISTS public.guru (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    nip TEXT,
    jabatan TEXT NOT NULL,
    mata_pelajaran TEXT,
    tipe TEXT NOT NULL DEFAULT 'guru',
    pendidikan_terakhir TEXT,
    foto_url TEXT,
    aktif BOOLEAN DEFAULT true,
    urutan INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Ekstrakurikuler
CREATE TABLE IF NOT EXISTS public.ekskul (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    deskripsi TEXT,
    pembina TEXT,
    jadwal TEXT,
    foto_url TEXT,
    aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Prestasi
CREATE TABLE IF NOT EXISTS public.prestasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_prestasi TEXT NOT NULL,
    nama_siswa TEXT NOT NULL,
    tingkat TEXT NOT NULL,
    tahun INTEGER NOT NULL,
    kategori TEXT NOT NULL,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Akademik (Single Row) - sudah termasuk kolom terbaru
CREATE TABLE IF NOT EXISTS public.akademik (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kurikulum TEXT NOT NULL DEFAULT 'Merdeka Belajar',
    deskripsi_kurikulum TEXT,
    kalender_akademik_url TEXT,   -- <-- Nama kolom final (bukan kalender_pdf_url)
    jadwal_pelajaran_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Program Unggulan
CREATE TABLE IF NOT EXISTS public.program_unggulan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    ikon TEXT,
    urutan INTEGER DEFAULT 0,
    aktif BOOLEAN DEFAULT true,
    akademik_id UUID REFERENCES public.akademik(id) ON DELETE CASCADE
);

-- Tabel Fasilitas
CREATE TABLE IF NOT EXISTS public.fasilitas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    deskripsi TEXT,
    foto_url TEXT,
    urutan INTEGER DEFAULT 0,
    aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Pesan Kontak (dari Publik ke Admin)
CREATE TABLE IF NOT EXISTS public.pesan_kontak (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_pengirim TEXT NOT NULL,
    email_pengirim TEXT NOT NULL,
    subjek TEXT NOT NULL,
    pesan TEXT NOT NULL,
    sudah_dibaca BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Notifikasi (Alert in-app untuk Admin)
CREATE TABLE IF NOT EXISTS public.notifikasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    pesan TEXT NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'info',
    link_tuju TEXT,
    dibaca BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ============================================================
-- BAGIAN 3: TABEL TAMBAHAN
-- ============================================================

-- Tabel Info Kontak (termasuk kolom sosmed)
CREATE TABLE IF NOT EXISTS public.info_kontak (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alamat TEXT,
    email TEXT,
    telepon TEXT,
    jam_operasional TEXT,
    embed_maps TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Login Attempts (Rate Limiting)
CREATE TABLE IF NOT EXISTS public.login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    attempt_count INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Komentar Berita
CREATE TABLE IF NOT EXISTS public.komentar_berita (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    berita_id UUID REFERENCES public.berita(id) ON DELETE CASCADE,
    nama_pengirim VARCHAR(255) NOT NULL,
    isi_komentar TEXT NOT NULL,
    admin_reply TEXT,
    admin_reply_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ============================================================
-- BAGIAN 4: ALTER TABLE
-- (Hanya dijalankan jika database SUDAH ada dan tabel perlu
--  ditambah/diubah kolomnya. Aman dijalankan berulang kali
--  karena memakai IF NOT EXISTS / IF EXISTS)
-- ============================================================

-- [akademik] Rename kolom lama jika masih pakai nama lama
-- CATATAN: Lewati jika membuat database baru (kolom sudah benar di atas)
-- ALTER TABLE public.akademik RENAME COLUMN kalender_pdf_url TO kalender_akademik_url;

-- [akademik] Pastikan kolom jadwal_pelajaran_url ada
ALTER TABLE public.akademik ADD COLUMN IF NOT EXISTS jadwal_pelajaran_url TEXT;

-- [komentar_berita] Pastikan kolom balasan admin ada
ALTER TABLE public.komentar_berita ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE public.komentar_berita ADD COLUMN IF NOT EXISTS admin_reply_at TIMESTAMP WITH TIME ZONE;

-- [info_kontak] Pastikan kolom sosmed ada
ALTER TABLE public.info_kontak ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.info_kontak ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.info_kontak ADD COLUMN IF NOT EXISTS youtube_url TEXT;


-- ============================================================
-- BAGIAN 5: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Aktifkan RLS semua tabel
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profil_sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ekskul ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akademik ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_unggulan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fasilitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesan_kontak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.info_kontak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komentar_berita ENABLE ROW LEVEL SECURITY;

-- Kebijakan BACA PUBLIK
CREATE POLICY IF NOT EXISTS "Publik bisa baca profil sekolah"      ON public.profil_sekolah   FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca berita terpublish"   ON public.berita            FOR SELECT USING (published = true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca pengumuman aktif"    ON public.pengumuman        FOR SELECT USING (aktif = true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca galeri"              ON public.galeri            FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca data guru"           ON public.guru              FOR SELECT USING (aktif = true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca ekskul"              ON public.ekskul            FOR SELECT USING (aktif = true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca prestasi"            ON public.prestasi          FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca info akademik"       ON public.akademik          FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca program unggulan"    ON public.program_unggulan  FOR SELECT USING (aktif = true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca fasilitas"           ON public.fasilitas         FOR SELECT USING (aktif = true);
CREATE POLICY IF NOT EXISTS "Publik bisa baca info kontak"         ON public.info_kontak       FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Publik bisa melihat komentar"         ON public.komentar_berita   FOR SELECT USING (true);

-- Kebijakan INSERT Publik
CREATE POLICY IF NOT EXISTS "Publik bisa mengirim pesan kontak"    ON public.pesan_kontak      FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Publik bisa mengirim komentar"        ON public.komentar_berita   FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Server bisa insert login attempts"    ON public.login_attempts    FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Server bisa update login attempts"    ON public.login_attempts    FOR UPDATE USING (true);

-- Kebijakan ADMIN (Terautentikasi)
CREATE POLICY IF NOT EXISTS "Admin bisa akses admin penuh"         ON public.admin             FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses profil penuh"        ON public.profil_sekolah    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses berita penuh"        ON public.berita            FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses pengumuman penuh"    ON public.pengumuman        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses galeri penuh"        ON public.galeri            FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses guru penuh"          ON public.guru              FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses ekskul penuh"        ON public.ekskul            FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses prestasi penuh"      ON public.prestasi          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses akademik penuh"      ON public.akademik          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses program penuh"       ON public.program_unggulan  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa akses fasilitas penuh"     ON public.fasilitas         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa kelola pesan kontak"       ON public.pesan_kontak      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa kelola notifikasi"         ON public.notifikasi        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa kelola info kontak"        ON public.info_kontak       FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa insert info kontak"        ON public.info_kontak       FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa lihat login attempts"      ON public.login_attempts    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Admin bisa membalas komentar"         ON public.komentar_berita   FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admin bisa hapus komentar"            ON public.komentar_berita   FOR DELETE TO authenticated USING (true);


-- ============================================================
-- BAGIAN 6: STORAGE POLICIES (Bucket: media)
-- ============================================================

CREATE POLICY IF NOT EXISTS "Izinkan publik lihat media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

CREATE POLICY IF NOT EXISTS "Izinkan admin upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY IF NOT EXISTS "Izinkan admin menghapus media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

CREATE POLICY IF NOT EXISTS "Izinkan admin mengupdate media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');


-- ============================================================
-- BAGIAN 7: DATA AWAL (SEEDING)
-- ============================================================

-- Satu record profil sekolah default
INSERT INTO public.profil_sekolah (nama_sekolah, npsn)
VALUES ('SMP Negeri 2 Tanjungkerta', '20208422')
ON CONFLICT DO NOTHING;

-- Satu record akademik default
INSERT INTO public.akademik (kurikulum)
VALUES ('Merdeka Belajar')
ON CONFLICT DO NOTHING;

-- Satu record info kontak default
INSERT INTO public.info_kontak (alamat, email, telepon, jam_operasional, embed_maps, facebook_url, instagram_url, youtube_url)
VALUES (
    'Boros, Desa Tanjungkerta, Kecamatan Tanjungkerta, Kabupaten Sumedang, Jawa Barat 45354',
    'smpn2tanjungkerta@gmail.com',
    '(0261) 201121',
    'Senin - Jumat: 07:00 - 15:00',
    'https://maps.google.com/maps?q=SMP%20Negeri%202%20Tanjungkerta%20Sumedang&t=&z=17&ie=UTF8&iwloc=&output=embed',
    'https://facebook.com',
    'https://instagram.com',
    'https://youtube.com'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SELESAI! Database SMPN 2 Tanjungkerta siap digunakan.
-- ============================================================
