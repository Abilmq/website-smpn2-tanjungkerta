'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function fetchAllEkskul() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ekskul')
    .select('*')
    .order('nama', { ascending: true })

  if (error) {
    console.error('Error fetching ekskul:', error.message)
    return []
  }

  return data
}

export async function fetchEkskulById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ekskul')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching ekskul by id:', error.message)
    return null
  }

  return data
}

export async function createEkskul(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const nama = formData.get('nama') as string
  const deskripsi = formData.get('deskripsi') as string
  const pembina = formData.get('pembina') as string
  const jadwal = formData.get('jadwal') as string
  const foto_url = formData.get('foto_url') as string
  const aktif = formData.get('aktif') === 'true'

  if (!nama) {
    return { error: 'Nama ekstrakurikuler wajib diisi' }
  }

  const { error } = await supabase
    .from('ekskul')
    .insert({
      nama,
      deskripsi,
      pembina,
      jadwal,
      foto_url: foto_url || null,
      aktif,
    })

  if (error) {
    console.error('Error creating ekskul:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/kesiswaan/ekskul')
  redirect('/dashboard/kesiswaan/ekskul')
}

export async function updateEkskul(id: string, formData: FormData) {
  const supabase = await createClient()

  const nama = formData.get('nama') as string
  const deskripsi = formData.get('deskripsi') as string
  const pembina = formData.get('pembina') as string
  const jadwal = formData.get('jadwal') as string
  const foto_url = formData.get('foto_url') as string
  const aktif = formData.get('aktif') === 'true'

  if (!nama) {
    return { error: 'Nama ekstrakurikuler wajib diisi' }
  }

  const { error } = await supabase
    .from('ekskul')
    .update({
      nama,
      deskripsi,
      pembina,
      jadwal,
      foto_url: foto_url || null,
      aktif,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating ekskul:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/kesiswaan/ekskul')
  redirect('/dashboard/kesiswaan/ekskul')
}

export async function deleteEkskul(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('ekskul')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting ekskul:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/kesiswaan/ekskul')
  return { success: true }
}

export async function toggleEkskulAktif(id: string, currentStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('ekskul')
    .update({ aktif: !currentStatus })
    .eq('id', id)

  if (error) {
    console.error('Error toggling status ekskul:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/kesiswaan/ekskul')
  return { success: true }
}
