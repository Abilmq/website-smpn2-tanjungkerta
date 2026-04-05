-- ==========================================
-- SKEMA DATABASE WEBSITE SMPN 2 TANJUNGKERTA
-- ==========================================
-- Dijalankan pada Supabase SQL Editor
-- Total Tabel: 11 (Semua konten di-manage dari DB)
-- ==========================================

-- 1. Mengaktifkan ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Memastikan timezone ke WIB (Optional)
SET timezone = 'Asia/Jakarta';

-- ==========================================
-- TABEL DAN STRUKTUR
-- ==========================================

-- Tabel Admin 
-- Menyimpan detail admin yang sudah login via Supabase Auth
CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Profil Sekolah (Tabel tunggal/Single row)
CREATE TABLE IF NOT EXISTS profil_sekolah (
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
CREATE TABLE IF NOT EXISTS berita (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    konten TEXT NOT NULL,
    kategori TEXT NOT NULL DEFAULT 'Umum',
    thumbnail_url TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    admin_id UUID REFERENCES admin(id) ON DELETE SET NULL
);

-- Tabel Pengumuman
CREATE TABLE IF NOT EXISTS pengumuman (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    konten TEXT NOT NULL,
    tanggal_berlaku DATE NOT NULL,
    featured BOOLEAN DEFAULT false,
    aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    admin_id UUID REFERENCES admin(id) ON DELETE SET NULL
);

-- Tabel Galeri
CREATE TABLE IF NOT EXISTS galeri (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    deskripsi TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image', -- image or video
    kategori TEXT NOT NULL DEFAULT 'Kegiatan',
    tanggal_kegiatan DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Guru & Tendik
CREATE TABLE IF NOT EXISTS guru (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    nip TEXT,
    jabatan TEXT NOT NULL,
    mata_pelajaran TEXT,
    tipe TEXT NOT NULL DEFAULT 'guru', -- guru or tendik
    pendidikan_terakhir TEXT,
    foto_url TEXT,
    aktif BOOLEAN DEFAULT true,
    urutan INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Ekstrakurikuler
CREATE TABLE IF NOT EXISTS ekskul (
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
CREATE TABLE IF NOT EXISTS prestasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_prestasi TEXT NOT NULL,
    nama_siswa TEXT NOT NULL,
    tingkat TEXT NOT NULL, -- Kabupaten, Provinsi, Nasional
    tahun INTEGER NOT NULL,
    kategori TEXT NOT NULL, -- Akademik, Non-Akademik
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Akademik (Tabel tunggal/Single row)
CREATE TABLE IF NOT EXISTS akademik (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kurikulum TEXT NOT NULL DEFAULT 'Merdeka Belajar',
    deskripsi_kurikulum TEXT,
    kalender_akademik_url TEXT,
    jadwal_pelajaran_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Program Unggulan
CREATE TABLE IF NOT EXISTS program_unggulan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    ikon TEXT,
    urutan INTEGER DEFAULT 0,
    aktif BOOLEAN DEFAULT true,
    akademik_id UUID REFERENCES akademik(id) ON DELETE CASCADE
);

-- Tabel Fasilitas
CREATE TABLE IF NOT EXISTS fasilitas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    deskripsi TEXT,
    foto_url TEXT,
    urutan INTEGER DEFAULT 0,
    aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Pesan Kontak (Dari Publik ke Admin)
CREATE TABLE IF NOT EXISTS pesan_kontak (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_pengirim TEXT NOT NULL,
    email_pengirim TEXT NOT NULL,
    subjek TEXT NOT NULL,
    pesan TEXT NOT NULL,
    sudah_dibaca BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Notifikasi (Alert In-App untuk Admin)
CREATE TABLE IF NOT EXISTS notifikasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    pesan TEXT NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'info', -- info, warning, success
    link_tuju TEXT,
    dibaca BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Mengaktifkan RLS untuk semua tabel
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE profil_sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE ekskul ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE akademik ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_unggulan ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasilitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesan_kontak ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifikasi ENABLE ROW LEVEL SECURITY;

-- 1. Kebijakan BACA (Select) - Semua data bisa DIBACA oleh PUBLIK kecuali notifikasi & pesan kontak 
CREATE POLICY "Publik bisa baca profil sekolah" ON profil_sekolah FOR SELECT USING (true);
CREATE POLICY "Publik bisa baca berita terpublish" ON berita FOR SELECT USING (published = true);
CREATE POLICY "Publik bisa baca pengumuman aktif" ON pengumuman FOR SELECT USING (aktif = true);
CREATE POLICY "Publik bisa baca galeri" ON galeri FOR SELECT USING (true);
CREATE POLICY "Publik bisa baca data guru" ON guru FOR SELECT USING (aktif = true);
CREATE POLICY "Publik bisa baca ekskul" ON ekskul FOR SELECT USING (aktif = true);
CREATE POLICY "Publik bisa baca prestasi" ON prestasi FOR SELECT USING (true);
CREATE POLICY "Publik bisa baca info akademik" ON akademik FOR SELECT USING (true);
CREATE POLICY "Publik bisa baca program unggulan" ON program_unggulan FOR SELECT USING (aktif = true);
CREATE POLICY "Publik bisa baca fasilitas" ON fasilitas FOR SELECT USING (aktif = true);

-- 2. Kebijakan TULIS (Insert) - Publik HANYA bisa mengirim pesan_kontak
CREATE POLICY "Publik bisa mengirim pesan kontak" ON pesan_kontak FOR INSERT WITH CHECK (true);

-- 3. Kebijakan ADMIN - Admin yang terautentikasi bisa TULIS, UPDATE, BACA, DELETE SEMUA TABEL
CREATE POLICY "Admin bisa akses admin penuh" ON admin FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses profil penuh" ON profil_sekolah FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses berita penuh" ON berita FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses pengumuman penuh" ON pengumuman FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses galeri penuh" ON galeri FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses guru penuh" ON guru FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses ekskul penuh" ON ekskul FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses prestasi penuh" ON prestasi FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses akademik penuh" ON akademik FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses program penuh" ON program_unggulan FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa akses fasilitas penuh" ON fasilitas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa kelola pesan kontak" ON pesan_kontak FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin bisa kelola notifikasi" ON notifikasi FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- SEEDING DATA AWAL (INITIAL SETUP)
-- ==========================================

-- Membuat satu record Profil Sekolah kosong (untuk di-update dari dashboard)
INSERT INTO profil_sekolah (nama_sekolah, npsn) 
VALUES ('SMP Negeri 2 Tanjungkerta', '20208422')
ON CONFLICT DO NOTHING;

-- Membuat satu record Akademik kosong
INSERT INTO akademik (kurikulum) 
VALUES ('Merdeka Belajar')
ON CONFLICT DO NOTHING;
