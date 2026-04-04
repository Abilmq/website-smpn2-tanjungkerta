'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function fetchAllGuru() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('guru')
    .select('*')
    .order('urutan', { ascending: true })
    .order('nama', { ascending: true })

  if (error) {
    console.error('Error fetching guru:', error.message)
    return []
  }

  return data
}

export async function fetchGuruById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('guru')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching guru by id:', error.message)
    return null
  }

  return data
}

export async function createGuru(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const nama = formData.get('nama') as string
  const nip = formData.get('nip') as string
  const jabatan = formData.get('jabatan') as string
  const mata_pelajaran = formData.get('mata_pelajaran') as string
  const tipe = formData.get('tipe') as string
  const pendidikan_terakhir = formData.get('pendidikan_terakhir') as string
  const foto_url = formData.get('foto_url') as string
  const urutan = parseInt(formData.get('urutan') as string || '0', 10)
  const aktif = formData.get('aktif') === 'true'

  if (!nama || !jabatan || !tipe) {
    return { error: 'Nama, Jabatan, dan Tipe wajib diisi' }
  }

  const { error } = await supabase
    .from('guru')
    .insert({
      nama,
      nip,
      jabatan,
      mata_pelajaran,
      tipe,
      pendidikan_terakhir,
      foto_url: foto_url || null,
      urutan,
      aktif,
    })

  if (error) {
    console.error('Error creating guru:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/guru')
  redirect('/dashboard/guru')
}

export async function updateGuru(id: string, formData: FormData) {
  const supabase = await createClient()

  const nama = formData.get('nama') as string
  const nip = formData.get('nip') as string
  const jabatan = formData.get('jabatan') as string
  const mata_pelajaran = formData.get('mata_pelajaran') as string
  const tipe = formData.get('tipe') as string
  const pendidikan_terakhir = formData.get('pendidikan_terakhir') as string
  const foto_url = formData.get('foto_url') as string
  const urutan = parseInt(formData.get('urutan') as string || '0', 10)
  const aktif = formData.get('aktif') === 'true'

  if (!nama || !jabatan || !tipe) {
    return { error: 'Nama, Jabatan, dan Tipe wajib diisi' }
  }

  const { error } = await supabase
    .from('guru')
    .update({
      nama,
      nip,
      jabatan,
      mata_pelajaran,
      tipe,
      pendidikan_terakhir,
      foto_url: foto_url || null,
      urutan,
      aktif,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating guru:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/guru')
  redirect('/dashboard/guru')
}

export async function deleteGuru(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('guru')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting guru:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/guru')
  return { success: true }
}

export async function toggleGuruAktif(id: string, currentStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('guru')
    .update({ aktif: !currentStatus })
    .eq('id', id)

  if (error) {
    console.error('Error toggling status guru:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/guru')
  return { success: true }
}
