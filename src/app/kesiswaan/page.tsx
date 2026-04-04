import PageHeader from '@/components/ui/PageHeader'
import { Trophy, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import EkskulGrid from './EkskulGrid'

export const revalidate = 60

export default async function KesiswaanPage() {
  const supabase = await createClient()

  const [ekskulRes, prestasiRes] = await Promise.all([
    supabase
      .from('ekskul')
      .select('*')
      .eq('aktif', true)
      .order('nama', { ascending: true }),
    supabase
      .from('prestasi')
      .select('*')
      .order('tahun', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(12)
  ])

  const ekskulList = ekskulRes.data || []
  const prestasiList = prestasiRes.data || []

  const TINGKAT_COLORS: Record<string, string> = {
    'Kabupaten': 'bg-blue-100 text-blue-700 border-blue-200',
    'Provinsi': 'bg-purple-100 text-purple-700 border-purple-200',
    'Nasional': 'bg-amber-100 text-amber-700 border-amber-200',
    'Internasional': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Kesiswaan & Ekstrakurikuler" 
        description="Wadah pengembangan minat, bakat, dan prestasi siswa SMP Negeri 2 Tanjungkerta."
        crumbs={[
          { label: 'Kesiswaan' }
        ]} 
      />

      {/* Section Ekskul */}
      <section className="py-24 px-4 md:px-6 container mx-auto max-w-6xl relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-1.5 bg-brand-600"></div>
          <span className="font-bold text-brand-600 tracking-widest uppercase text-sm">Ekstrakurikuler</span>
        </div>

        <EkskulGrid data={ekskulList} />
      </section>

      {/* Section Prestasi */}
      <section className="py-24 px-4 md:px-6 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-1.5 bg-accent-500"></div>
            <span className="font-bold text-accent-600 tracking-widest uppercase text-sm">Prestasi Siswa</span>
          </div>

          {prestasiList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prestasiList.map((prestasi) => (
                <div key={prestasi.id} className="group bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:bg-white hover:shadow-lg hover:border-accent-500 transition-all hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent-500 transition-colors">
                      <Trophy className="w-6 h-6 text-accent-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${TINGKAT_COLORS[prestasi.tingkat] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {prestasi.tingkat}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 group-hover:text-accent-600 transition-colors">{prestasi.nama_prestasi}</h3>
                  <p className="text-slate-600 text-sm mb-1">
                    <span className="font-semibold">Siswa:</span> {prestasi.nama_siswa}
                  </p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{prestasi.kategori}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-400">{prestasi.tahun}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <Trophy className="w-10 h-10 text-slate-300 mb-4" />
              <p className="text-slate-500">Data prestasi segera hadir.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
