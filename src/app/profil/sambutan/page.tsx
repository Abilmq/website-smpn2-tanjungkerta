import type { Metadata } from 'next'
import Image from 'next/image'
import PageHeader from '@/components/ui/PageHeader'
import { fetchProfilSekolah } from '@/app/actions/profil.actions'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Sambutan Kepala Sekolah | SMPN 2 Tanjungkerta',
  description: 'Sambutan resmi dari Kepala Sekolah SMP Negeri 2 Tanjungkerta.',
}

export default async function SambutanPage() {
  const profil = await fetchProfilSekolah()

  const namaKepsek = profil?.nama_kepsek || 'Kepala Sekolah'
  const sambutan = profil?.sambutan_kepsek || 'Belum ada data sambutan dari Kepala Sekolah.'
  const fotoUrl = profil?.foto_kepsek || '/kepsek.png'

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Sambutan Kepala Sekolah" 
        crumbs={[
          { label: 'Profil', href: '#' },
          { label: 'Sambutan' }
        ]} 
      />

      <section className="py-24 px-4 md:px-6 container mx-auto max-w-5xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Sisi Kiri: Foto Kepala Sekolah */}
          <div className="md:col-span-4 space-y-6">
            <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden shadow-xl bg-slate-200 border border-slate-200 group">
              <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-transparent transition-colors z-10"></div>
              <Image src={fotoUrl} alt={`Foto ${namaKepsek}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" priority />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <h3 className="text-2xl font-black text-slate-900 mb-1">{namaKepsek}</h3>
              <p className="text-brand-600 font-bold text-sm tracking-wider uppercase">Kepala Sekolah</p>
            </div>
          </div>

          {/* Sisi Kanan: Isi Sambutan */}
          <div className="md:col-span-8 bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm prose prose-slate md:prose-lg max-w-none">
            <h2 className="text-3xl font-black text-slate-900 mb-8 border-l-8 border-accent-500 pl-4">Menyapa Bersama, Mengukir Prestasi</h2>
            
            <div className="leading-relaxed text-slate-800 whitespace-pre-wrap">
              {sambutan}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
