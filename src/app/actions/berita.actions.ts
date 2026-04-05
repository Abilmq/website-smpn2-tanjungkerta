'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Helper: generate slug dari judul
function generateSlug(judul: string): string {
  return judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Date.now()
}

// Upload gambar ke Supabase Storage
export async function uploadImage(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi' }

  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'Tidak ada file' }

  // Buat nama file unik
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
  const folder = formData.get('folder') || 'berita'
  const filePath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from('media')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return { error: error.message }

  // Dapatkan public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath)

  return { url: publicUrl }
}

// Hapus gambar dari Supabase Storage
export async function deleteImageFile(url: string) {
  if (!url) return { error: 'URL kosong' }
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi' }

  // Extract filepath from public URL (everything after /media/)
  const splitUrl = url.split('/media/')
  if (splitUrl.length !== 2) return { error: 'URL media tidak valid' }
  
  const filePath = splitUrl[1]

  const { error } = await supabase.storage
    .from('media')
    .remove([filePath])

  if (error) return { error: error.message }
  return { success: true }
}

// Fetch semua berita (untuk halaman list admin)
export async function fetchAllBerita() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('berita')
    .select('id, judul, slug, kategori, published, published_at, created_at, thumbnail_url')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Fetch satu berita berdasarkan ID (untuk form edit)
export async function fetchBeritaById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Buat berita baru
export async function createBerita(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // FIX FK Constraint: Pastikan user ada di tabel admin dulu
  await supabase.from('admin').upsert({
    id: user.id,
    email: user.email!,
    nama: user.email!.split('@')[0],
  }, { onConflict: 'id' })

  const judul = formData.get('judul') as string
  const konten = formData.get('konten') as string
  const kategori = formData.get('kategori') as string
  const published = formData.get('published') === 'true'
  const thumbnail_url = formData.get('thumbnail_url') as string || null

  const slug = generateSlug(judul)

  const { error } = await supabase.from('berita').insert({
    judul,
    slug,
    konten,
    kategori,
    published,
    thumbnail_url,
    admin_id: user.id,
    published_at: published ? new Date().toISOString() : null,
  })

  if (error) {
    return { error: error.message }
  }

  if (published) {
    await supabase.from('notifikasi').insert({
      judul: 'Berita Baru Dipublikasikan',
      pesan: `Berita "${judul}" telah berhasil dipublikasikan.`,
      tipe: 'success',
      link_tuju: '/dashboard/berita',
    })
  }

  revalidatePath('/dashboard/berita')
  revalidatePath('/')
  redirect('/dashboard/berita')
}

// Update berita
export async function updateBerita(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const judul = formData.get('judul') as string
  const konten = formData.get('konten') as string
  const kategori = formData.get('kategori') as string
  const published = formData.get('published') === 'true'
  const thumbnail_url = formData.get('thumbnail_url') as string || null

  const { error } = await supabase
    .from('berita')
    .update({
      judul,
      konten,
      kategori,
      published,
      thumbnail_url,
      published_at: published ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/berita')
  revalidatePath('/')
  redirect('/dashboard/berita')
}

// Hapus berita
export async function deleteBerita(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('berita')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/berita')
  revalidatePath('/')
}

// Toggle status published/draft
export async function togglePublishBerita(id: string, currentStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('berita')
    .update({
      published: !currentStatus,
      published_at: !currentStatus ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/berita')
  revalidatePath('/')
}

// ==== FITUR BARU: KOMENTAR & SIDEBAR ====

// Fetch daftar berita lainnya (untuk sidebar)
export async function fetchBeritaLainnya(currentId: string, limit: number = 5) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('berita')
    .select('id, judul, slug, thumbnail_url, created_at')
    .eq('published', true)
    .neq('id', currentId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetchBeritaLainnya:", error)
    return []
  }
  return data || []
}

// Fetch list komentar berita
export async function fetchKomentar(beritaId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('komentar_berita')
    .select('*')
    .eq('berita_id', beritaId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error("Error fetchKomentar:", error)
    return []
  }
  return data || []
}

// Kirim komentar baru
export async function kirimKomentar(formData: FormData) {
  const supabase = await createClient()
  const berita_id = formData.get('berita_id') as string
  const nama_pengirim = formData.get('nama_pengirim') as string
  const isi_komentar = formData.get('isi_komentar') as string
  const url_path = formData.get('url_path') as string

  if (!berita_id || !nama_pengirim || !isi_komentar) {
    return { error: 'Semua kolom wajib diisi!' }
  }

  const { error } = await supabase
    .from('komentar_berita')
    .insert({ berita_id, nama_pengirim, isi_komentar })

  if (error) return { error: error.message }

  // Kirim notifikasi ke lonceng Admin
  await supabase.from('notifikasi').insert({
    judul: 'Ada Komentar Baru!',
    pesan: `Pengunjung bernama ${nama_pengirim} baru saja memberikan komentar pada berita.`,
    tipe: 'info',
    link_tuju: '/dashboard/berita/komentar',
  })
  
  if (url_path) revalidatePath(url_path)
  return { success: true }
}

// Fetch semua komentar (untuk dashboard admin)
export async function fetchSemuaKomentar() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('komentar_berita')
    .select(`
      *,
      berita:berita_id (
        judul,
        slug
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetchSemuaKomentar:", error)
    return []
  }
  return data || []
}

// Balas komentar (oleh admin)
export async function balasKomentar(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak berhak membalas komentar.' }

  const komentar_id = formData.get('komentar_id') as string
  const admin_reply = formData.get('admin_reply') as string

  if (!komentar_id || !admin_reply) {
    return { error: 'Balasan tidak boleh kosong.' }
  }

  const { error } = await supabase
    .from('komentar_berita')
    .update({ 
      admin_reply,
      admin_reply_at: new Date().toISOString()
    })
    .eq('id', komentar_id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/berita/komentar')
  return { success: true }
}

// Hapus komentar (oleh admin)
export async function hapusKomentar(komentar_id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak memiliki izin.' }

  const { error } = await supabase
    .from('komentar_berita')
    .delete()
    .eq('id', komentar_id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/berita/komentar')
  return { success: true }
}
