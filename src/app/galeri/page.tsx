import type { Metadata } from 'next'
import PageHeader from '@/components/ui/PageHeader'
import { createClient } from '@/lib/supabase/server'
import GaleriGrid from './GaleriGrid'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Galeri Sekolah | SMPN 2 Tanjungkerta',
  description: 'Album visual kegiatan belajar, rekreasi, dan hari besar SMP Negeri 2 Tanjungkerta.',
}

export default async function GaleriPage() {
  const supabase = await createClient()

  const { data: galeriList } = await supabase
    .from('galeri')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Galeri Sekolah" 
        description="Album visual kegiatan belajar, rekreasi, dan hari besar sekolah."
        crumbs={[
          { label: 'Galeri' }
        ]} 
      />

      <section className="py-24 px-4 md:px-6 container mx-auto max-w-6xl">
        <GaleriGrid data={galeriList || []} />
      </section>
    </div>
  )
}
