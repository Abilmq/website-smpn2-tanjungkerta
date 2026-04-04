ALTER TABLE info_kontak
ADD COLUMN facebook_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN youtube_url TEXT;

UPDATE info_kontak
SET 
  facebook_url = 'https://facebook.com',
  instagram_url = 'https://instagram.com',
  youtube_url = 'https://youtube.com';
