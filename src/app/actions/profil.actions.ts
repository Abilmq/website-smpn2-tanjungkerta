'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function fetchProfilSekolah() {
  const supabase = await createClient()

  // We assume only 1 row exists
  const { data, error } = await supabase
    .from('profil_sekolah')
    .select('*')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profil_sekolah:', error.message)
    return null
  }

  return data
}

export async function saveProfilSekolah(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const sejarah = formData.get('sejarah') as string
  const visi = formData.get('visi') as string
  const misi = formData.get('misi') as string
  const struktur_organisasi_url = formData.get('struktur_organisasi_url') as string
  const kepala_sekolah_nama = formData.get('kepala_sekolah_nama') as string
  const kepala_sekolah_sambutan = formData.get('kepala_sekolah_sambutan') as string
  const kepala_sekolah_foto_url = formData.get('kepala_sekolah_foto_url') as string

  // Check if a row exists
  const existing = await fetchProfilSekolah()

  if (existing) {
    // Update existing row
    const { error } = await supabase
      .from('profil_sekolah')
      .update({
        sejarah,
        visi,
        misi,
        struktur_organisasi_url: struktur_organisasi_url || null,
        nama_kepsek: kepala_sekolah_nama,
        sambutan_kepsek: kepala_sekolah_sambutan,
        foto_kepsek: kepala_sekolah_foto_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) {
      console.error('Error updating profil_sekolah:', error.message)
      return { error: error.message }
    }
  } else {
    // Insert new row
    const { error } = await supabase
      .from('profil_sekolah')
      .insert({
        sejarah,
        visi,
        misi,
        struktur_organisasi_url: struktur_organisasi_url || null,
        nama_kepsek: kepala_sekolah_nama,
        sambutan_kepsek: kepala_sekolah_sambutan,
        foto_kepsek: kepala_sekolah_foto_url || null,
      })

    if (error) {
      console.error('Error creating profil_sekolah:', error.message)
      return { error: error.message }
    }
  }

  revalidatePath('/dashboard/profil')
  return { success: true }
}
