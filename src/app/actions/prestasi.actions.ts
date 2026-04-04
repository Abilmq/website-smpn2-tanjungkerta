'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function fetchAllPrestasi() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('prestasi')
    .select('*')
    .order('tahun', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching prestasi:', error.message)
    return []
  }

  return data
}

export async function fetchPrestasiById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('prestasi')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching prestasi by id:', error.message)
    return null
  }

  return data
}

export async function createPrestasi(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const nama_prestasi = formData.get('nama_prestasi') as string
  const nama_siswa = formData.get('nama_siswa') as string
  const tingkat = formData.get('tingkat') as string
  const tahun = parseInt(formData.get('tahun') as string, 10)
  const kategori = formData.get('kategori') as string
  const foto_url = formData.get('foto_url') as string

  if (!nama_prestasi || !nama_siswa || !tingkat || !tahun || !kategori) {
    return { error: 'Semua field dengan tanda bintang (*) wajib diisi' }
  }

  const { error } = await supabase
    .from('prestasi')
    .insert({
      nama_prestasi,
      nama_siswa,
      tingkat,
      tahun,
      kategori,
      foto_url: foto_url || null,
    })

  if (error) {
    console.error('Error creating prestasi:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/kesiswaan/prestasi')
  redirect('/dashboard/kesiswaan/prestasi')
}

export async function updatePrestasi(id: string, formData: FormData) {
  const supabase = await createClient()

  const nama_prestasi = formData.get('nama_prestasi') as string
  const nama_siswa = formData.get('nama_siswa') as string
  const tingkat = formData.get('tingkat') as string
  const tahun = parseInt(formData.get('tahun') as string, 10)
  const kategori = formData.get('kategori') as string
  const foto_url = formData.get('foto_url') as string

  if (!nama_prestasi || !nama_siswa || !tingkat || !tahun || !kategori) {
    return { error: 'Semua field dengan tanda bintang (*) wajib diisi' }
  }

  const { error } = await supabase
    .from('prestasi')
    .update({
      nama_prestasi,
      nama_siswa,
      tingkat,
      tahun,
      kategori,
      foto_url: foto_url || null,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating prestasi:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/kesiswaan/prestasi')
  redirect('/dashboard/kesiswaan/prestasi')
}

export async function deletePrestasi(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('prestasi')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting prestasi:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/kesiswaan/prestasi')
  return { success: true }
}
