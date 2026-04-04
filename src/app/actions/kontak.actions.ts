'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Kirim pesan kontak dari halaman publik
export async function kirimPesan(formData: FormData) {
  const supabase = await createClient()

  const nama_pengirim = formData.get('nama_pengirim') as string
  const email_pengirim = formData.get('email_pengirim') as string
  const subjek = formData.get('subjek') as string
  const pesan = formData.get('pesan') as string

  if (!nama_pengirim || !email_pengirim || !subjek || !pesan) {
    return { error: 'Semua field wajib diisi' }
  }

  const { error } = await supabase
    .from('pesan_kontak')
    .insert({ nama_pengirim, email_pengirim, subjek, pesan })

  if (error) {
    console.error('Error kirim pesan:', error.message)
    return { error: 'Gagal mengirim pesan. Silakan coba lagi.' }
  }

  revalidatePath('/dashboard/pesan')
  return { success: true }
}

export async function fetchAllKontak() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pesan_kontak')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pesan_kontak:', error.message)
    return []
  }

  return data
}

export async function fetchKontakById(id: string) {
  const supabase = await createClient()

  // Set dibaca = true whenever we fetch specific detail
  await setKontakDibaca(id)

  const { data, error } = await supabase
    .from('pesan_kontak')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching kontak by id:', error.message)
    return null
  }

  return data
}

export async function setKontakDibaca(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pesan_kontak')
    .update({ dibaca: true })
    .eq('id', id)

  if (error) {
    console.error('Error updating status dibaca:', error.message)
    return { error: error.message }
  }

  return { success: true }
}

export async function deleteKontak(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pesan_kontak')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting pesan_kontak:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/pesan')
  return { success: true }
}

export async function fetchInfoKontak() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('info_kontak')
    .select('*')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching info_kontak:', error.message)
    return null
  }

  return data
}

export async function saveInfoKontak(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const alamat = formData.get('alamat') as string
  const email = formData.get('email') as string
  const telepon = formData.get('telepon') as string
  const jam_operasional = formData.get('jam_operasional') as string
  const embed_maps = formData.get('embed_maps') as string
  const facebook_url = formData.get('facebook_url') as string
  const instagram_url = formData.get('instagram_url') as string
  const youtube_url = formData.get('youtube_url') as string

  const existing = await fetchInfoKontak()

  if (existing) {
    const { error } = await supabase
      .from('info_kontak')
      .update({
        alamat,
        email,
        telepon,
        jam_operasional,
        embed_maps,
        facebook_url,
        instagram_url,
        youtube_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('info_kontak')
      .insert({
        alamat,
        email,
        telepon,
        jam_operasional,
        embed_maps,
        facebook_url,
        instagram_url,
        youtube_url,
      })

    if (error) return { error: error.message }
  }

  revalidatePath('/dashboard/kontak/info')
  revalidatePath('/kontak')
  return { success: true }
}
