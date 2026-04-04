import PageHeader from '@/components/ui/PageHeader'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AkademikPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Akademik" 
        description="Halaman ini sedang dalam tahap pengembangan."
        crumbs={[
          { label: 'Akademik' }
        ]} 
      />

      <section className="py-24 px-4 md:px-6 container mx-auto text-center relative z-10">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Modul Segera Hadir</h2>
        <p className="text-slate-600 mb-8 max-w-lg mx-auto">Kami sedang mempersiapkan data kurikulum, kalender akademik, dan program belajar untuk ditampilkan di halaman ini.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all">
          <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
        </Link>
      </section>
    </div>
  )
}
