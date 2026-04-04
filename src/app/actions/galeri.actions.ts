'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function fetchAllGaleri() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('galeri')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching galeri:', error.message)
    return []
  }

  return data
}

export async function fetchGaleriById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('galeri')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching galeri by id:', error.message)
    return null
  }

  return data
}

export async function createGaleri(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const judul = formData.get('judul') as string
  const deskripsi = formData.get('deskripsi') as string
  const media_url = formData.get('media_url') as string
  const kategori = formData.get('kategori') as string
  const tanggal_kegiatan = formData.get('tanggal_kegiatan') as string

  if (!judul || !media_url) {
    return { error: 'Judul dan media wajib diisi' }
  }

  const { error } = await supabase
    .from('galeri')
    .insert({
      judul,
      deskripsi,
      media_url,
      kategori,
      tanggal_kegiatan: tanggal_kegiatan || null,
    })

  if (error) {
    console.error('Error creating galeri:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/galeri')
  redirect('/dashboard/galeri')
}

export async function updateGaleri(id: string, formData: FormData) {
  const supabase = await createClient()

  const judul = formData.get('judul') as string
  const deskripsi = formData.get('deskripsi') as string
  const media_url = formData.get('media_url') as string
  const kategori = formData.get('kategori') as string
  const tanggal_kegiatan = formData.get('tanggal_kegiatan') as string

  if (!judul || !media_url) {
    return { error: 'Judul dan media wajib diisi' }
  }

  const { error } = await supabase
    .from('galeri')
    .update({
      judul,
      deskripsi,
      media_url,
      kategori,
      tanggal_kegiatan: tanggal_kegiatan || null,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating galeri:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/galeri')
  redirect('/dashboard/galeri')
}

export async function deleteGaleri(id: string) {
  const supabase = await createClient()

  // Ambil URL gambar terlebih dahulu sebelum barisnya dihapus
  const { data: item } = await supabase
    .from('galeri')
    .select('media_url')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('galeri')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting galeri:', error.message)
    return { error: error.message }
  }

  // Bersihkan file lama dari storage bucket
  if (item?.media_url) {
    const { deleteImageFile } = await import('./berita.actions')
    await deleteImageFile(item.media_url)
  }

  revalidatePath('/dashboard/galeri')
  return { success: true }
}
