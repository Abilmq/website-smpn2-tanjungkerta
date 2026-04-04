-- Pastikan policy untuk menghapus dan memperbarui file di bucket media diaktifkan
CREATE POLICY "Izinkan admin menghapus media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

CREATE POLICY "Izinkan admin mengupdate media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');
