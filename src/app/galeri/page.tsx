import PageHeader from '@/components/ui/PageHeader'
import { ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

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

      <section className="py-24 px-4 md:px-6 container mx-auto max-w-6xl relative z-10">
        {galeriList && galeriList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galeriList.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-500 transition-all hover:-translate-y-1">
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  {item.media_type === 'video' ? (
                    <video 
                      src={item.media_url} 
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img 
                      src={item.media_url} 
                      alt={item.judul} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest shadow-sm">{item.kategori}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-lg mb-1 leading-snug group-hover:text-brand-600 transition-colors">{item.judul}</h3>
                  {item.deskripsi && (
                    <p className="text-slate-500 text-sm line-clamp-2">{item.deskripsi}</p>
                  )}
                  {item.tanggal_kegiatan && (
                    <p className="text-xs text-slate-400 font-bold mt-3 uppercase tracking-wider">
                      {new Date(item.tanggal_kegiatan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <ImageIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Galeri Masih Kosong</h3>
            <p className="text-slate-500 max-w-md">Album visual kegiatan belajar, rekreasi, dan hari besar sekolah akan segera dipublikasikan di sini.</p>
          </div>
        )}
      </section>
    </div>
  )
}
