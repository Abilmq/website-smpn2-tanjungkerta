CREATE TABLE info_kontak (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alamat TEXT,
  email TEXT,
  telepon TEXT,
  jam_operasional TEXT,
  embed_maps TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert nilai default
INSERT INTO info_kontak (alamat, email, telepon, jam_operasional, embed_maps)
VALUES (
  'Boros, Desa Tanjungkerta, Kecamatan Tanjungkerta, Kabupaten Sumedang, Jawa Barat 45354',
  'smpn2tanjungkerta@gmail.com',
  '(0261) 201121',
  'Senin - Jumat: 07:00 - 15:00',
  'https://maps.google.com/maps?q=SMP%20Negeri%202%20Tanjungkerta%20Sumedang&t=&z=17&ie=UTF8&iwloc=&output=embed'
);

-- RLS Policies
ALTER TABLE info_kontak ENABLE ROW LEVEL SECURITY;

CREATE POLICY "info_kontak_select_all" 
ON info_kontak FOR SELECT 
TO public 
USING (true);

CREATE POLICY "info_kontak_update_auth" 
ON info_kontak FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "info_kontak_insert_auth" 
ON info_kontak FOR INSERT 
TO authenticated 
WITH CHECK (true);
