'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function fetchAllPengumuman() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pengumuman')
    .select('*, admin:admin_id (nama)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pengumuman:', error.message)
    return []
  }

  return data
}

export async function fetchPengumumanById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pengumuman')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching pengumuman by id:', error.message)
    return null
  }

  return data
}

export async function createPengumuman(formData: FormData) {
  const supabase = await createClient()

  // Get current user (admin)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const judul = formData.get('judul') as string
  const konten = formData.get('konten') as string
  const tanggal_berlaku = formData.get('tanggal_berlaku') as string
  const aktif = formData.get('aktif') === 'true'
  const featured = formData.get('featured') === 'true'

  if (!judul || !konten || !tanggal_berlaku) {
    return { error: 'Semua field wajib diisi' }
  }

  const { error } = await supabase
    .from('pengumuman')
    .insert({
      judul,
      konten,
      tanggal_berlaku,
      aktif,
      featured,
      admin_id: user.id
    })

  if (error) {
    console.error('Error creating pengumuman:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/pengumuman')
  redirect('/dashboard/pengumuman')
}

export async function updatePengumuman(id: string, formData: FormData) {
  const supabase = await createClient()

  const judul = formData.get('judul') as string
  const konten = formData.get('konten') as string
  const tanggal_berlaku = formData.get('tanggal_berlaku') as string
  const aktif = formData.get('aktif') === 'true'
  const featured = formData.get('featured') === 'true'

  if (!judul || !konten || !tanggal_berlaku) {
    return { error: 'Semua field wajib diisi' }
  }

  const { error } = await supabase
    .from('pengumuman')
    .update({
      judul,
      konten,
      tanggal_berlaku,
      aktif,
      featured,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating pengumuman:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/pengumuman')
  redirect('/dashboard/pengumuman')
}

export async function deletePengumuman(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pengumuman')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting pengumuman:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/pengumuman')
  return { success: true }
}

export async function togglePengumumanAktif(id: string, currentStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pengumuman')
    .update({ aktif: !currentStatus })
    .eq('id', id)

  if (error) {
    console.error('Error toggling status pengumuman:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/pengumuman')
  return { success: true }
}
