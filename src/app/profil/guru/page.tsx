import PageHeader from '@/components/ui/PageHeader'
import { Users, GraduationCap, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function GuruPage() {
  const supabase = await createClient()

  const { data: guruList } = await supabase
    .from('guru')
    .select('*')
    .eq('aktif', true)
    .order('urutan', { ascending: true })
    .order('nama', { ascending: true })

  // Pisahkan guru dan tendik
  const guru = guruList?.filter(g => g.tipe === 'guru') || []
  const tendik = guruList?.filter(g => g.tipe === 'tendik') || []

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Direktori Guru &amp; Tendik" 
        description="Tenaga pendidik dan kependidikan profesional SMP Negeri 2 Tanjungkerta."
        crumbs={[
          { label: 'Profil', href: '/profil' },
          { label: 'Guru & Tendik' }
        ]} 
      />

      <section className="py-24 px-4 md:px-6 container mx-auto max-w-6xl relative z-10">
        {guruList && guruList.length > 0 ? (
          <div className="space-y-20">
            
            {/* Section Guru */}
            {guru.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-12 h-1.5 bg-brand-600"></div>
                  <span className="font-bold text-brand-600 tracking-widest uppercase text-sm">Tenaga Pendidik ({guru.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {guru.map((item) => (
                    <div key={item.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-brand-500 transition-all hover:-translate-y-1">
                      <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                        {item.foto_url ? (
                          <img src={item.foto_url} alt={item.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand-50">
                            <User className="w-16 h-16 text-brand-200" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1">{item.nama}</h3>
                        <p className="text-brand-600 font-semibold text-sm mb-2">{item.jabatan}</p>
                        {item.mata_pelajaran && (
                          <p className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5" /> {item.mata_pelajaran}
                          </p>
                        )}
                        {item.nip && (
                          <p className="text-slate-400 text-xs mt-2">NIP: {item.nip}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Tendik */}
            {tendik.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-12 h-1.5 bg-accent-500"></div>
                  <span className="font-bold text-accent-600 tracking-widest uppercase text-sm">Tenaga Kependidikan ({tendik.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tendik.map((item) => (
                    <div key={item.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-accent-500 transition-all hover:-translate-y-1">
                      <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                        {item.foto_url ? (
                          <img src={item.foto_url} alt={item.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-accent-50">
                            <User className="w-16 h-16 text-accent-200" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1">{item.nama}</h3>
                        <p className="text-accent-600 font-semibold text-sm">{item.jabatan}</p>
                        {item.nip && (
                          <p className="text-slate-400 text-xs mt-2">NIP: {item.nip}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Data Guru Segera Hadir</h3>
            <p className="text-slate-500 max-w-md">Biodata dan daftar tenaga pendidik profesional kami sedang direkap untuk ditampilkan.</p>
          </div>
        )}
      </section>
    </div>
  )
}
