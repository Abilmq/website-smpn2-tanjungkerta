import type { Metadata } from 'next'
import PageHeader from '@/components/ui/PageHeader'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, BookOpen, Calendar, Clock } from 'lucide-react'
import { fetchAkademik } from '@/app/actions/akademik.actions'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Akademik | SMPN 2 Tanjungkerta',
  description: 'Informasi kurikulum, kalender akademik, dan jadwal pelajaran SMP Negeri 2 Tanjungkerta.',
}

export default async function AkademikPage() {
  const akademik = await fetchAkademik()
  
  const kurikulumHtml = akademik?.kurikulum || '<p class="text-slate-500 italic">Informasi kurikulum belum tersedia saat ini.</p>'

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Akademik" 
        description="Informasi Kurikulum, Kalender Akademik, dan Jadwal Pelajaran"
        crumbs={[
          { label: 'Akademik' }
        ]} 
      />

      <section className="py-16 px-4 md:px-6 container mx-auto max-w-5xl z-10">
        
        {/* Konten Kurikulum */}
        <div className="mb-16 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Kurikulum</h2>
          </div>
          
          <div 
            className="prose prose-slate max-w-none w-full text-left text-slate-700 leading-relaxed prose-headings:text-slate-900 prose-a:text-brand-600"
            dangerouslySetInnerHTML={{ __html: kurikulumHtml }}
          />
        </div>

        {/* Tautan Penting: Kalender & Jadwal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Kalender Akademik */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-start hover:border-brand-300 transition-colors">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Kalender Akademik</h3>
            <p className="text-slate-600 mb-8 flex-grow">Akses kalender akademik tahun ajaran berjalan untuk mengetahui jadwal kegiatan pembelajaran dan hari libur secara lengkap.</p>
            
            {akademik?.kalender_akademik_url ? (
              <a 
                href={akademik.kalender_akademik_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all w-full justify-center group"
              >
                Lihat Kalender Akademik
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            ) : (
              <div className="bg-slate-100 text-slate-500 px-6 py-3 rounded-xl font-medium text-center w-full">
                Belum Tersedia
              </div>
            )}
          </div>

          {/* Jadwal Pelajaran */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-start hover:border-brand-300 transition-colors">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Jadwal Pelajaran</h3>
            <p className="text-slate-600 mb-8 flex-grow">Akses jadwal mata pelajaran terkini untuk seluruh kelas agar proses Kegiatan Belajar Mengajar (KBM) berjalan kondusif.</p>
            
            {akademik?.jadwal_pelajaran_url ? (
              <a 
                href={akademik.jadwal_pelajaran_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold transition-all w-full justify-center group"
              >
                Lihat Jadwal Pelajaran
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            ) : (
              <div className="bg-slate-100 text-slate-500 px-6 py-3 rounded-xl font-medium text-center w-full">
                Belum Tersedia
              </div>
            )}
          </div>

        </div>

      </section>
    </div>
  )
}
