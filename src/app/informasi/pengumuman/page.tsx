import PageHeader from '@/components/ui/PageHeader'
import { CalendarDays, AlertTriangle, FileText, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function PengumumanPage() {
  const supabase = await createClient()

  const { data: pengumumanList } = await supabase
    .from('pengumuman')
    .select('*')
    .eq('aktif', true)
    .order('tanggal_berlaku', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Papan Pengumuman" 
        description="Informasi mutlak, edaran resmi, dan jadwal agenda kegiatan sekolah."
        crumbs={[
          { label: 'Informasi', href: '#' },
          { label: 'Pengumuman' }
        ]} 
      />

      <section className="py-24 px-4 md:px-6 container mx-auto max-w-5xl relative z-10">
        {pengumumanList && pengumumanList.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Agenda &amp; Edaran Aktif</h2>
                  <p className="text-slate-500 mt-2 font-medium">{pengumumanList.length} pengumuman aktif</p>
                </div>
              </div>

              <div className="space-y-6">
                {pengumumanList.map((item) => {
                  const dateStr = new Date(item.tanggal_berlaku).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                  const dateParts = dateStr.split(' ')

                  return (
                    <div key={item.id} className="group relative bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:border-brand-500 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                      
                      {/* Kotak Tanggal */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center min-w-[120px] shrink-0 group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors">
                        <CalendarDays className="w-6 h-6 mx-auto mb-2 text-brand-500" />
                        <span className="block font-black text-slate-900 group-hover:text-brand-700">{dateParts[0]} {dateParts[1]}</span>
                        <span className="block text-sm font-bold text-slate-500">{dateParts[2]}</span>
                      </div>

                      {/* Isi Pengumuman */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${
                            item.featured ? 'bg-alert-50 text-alert-600 border-alert-200' : 'bg-brand-50 text-brand-600 border-brand-200'
                          }`}>
                            {item.featured && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                            {!item.featured && <FileText className="w-3 h-3 inline mr-1" />}
                            {item.featured ? 'Penting' : 'Info'}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors">{item.judul}</h3>
                        <div 
                          className="text-slate-600 leading-relaxed text-sm md:text-base prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: item.konten }}
                        />
                      </div>
                      
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <Bell className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Belum Ada Pengumuman</h3>
            <p className="text-slate-500 max-w-md">Pengumuman dan edaran resmi sekolah akan ditampilkan di sini.</p>
          </div>
        )}
      </section>
    </div>
  )
}
