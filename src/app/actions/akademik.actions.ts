'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function fetchAkademik() {
  const supabase = await createClient()

  // We assume only 1 row exists representing the school's academic info
  const { data, error } = await supabase
    .from('akademik')
    .select('*')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is code for no rows returned, which is fine initially
    console.error('Error fetching akademik:', error.message)
    return null
  }

  return data
}

export async function saveAkademik(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const kurikulum = formData.get('kurikulum') as string
  const kalender_akademik_url = formData.get('kalender_akademik_url') as string
  const jadwal_pelajaran_url = formData.get('jadwal_pelajaran_url') as string

  // Check if a row exists
  const existing = await fetchAkademik()

  if (existing) {
    // Update existing row
    const { error } = await supabase
      .from('akademik')
      .update({
        kurikulum,
        kalender_akademik_url: kalender_akademik_url || null,
        jadwal_pelajaran_url: jadwal_pelajaran_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) {
      console.error('Error updating akademik:', error.message)
      return { error: error.message }
    }
  } else {
    // Insert new row
    const { error } = await supabase
      .from('akademik')
      .insert({
        kurikulum,
        kalender_akademik_url: kalender_akademik_url || null,
        jadwal_pelajaran_url: jadwal_pelajaran_url || null,
      })

    if (error) {
      console.error('Error creating akademik:', error.message)
      return { error: error.message }
    }
  }

  revalidatePath('/dashboard/akademik')
  return { success: true }
}
