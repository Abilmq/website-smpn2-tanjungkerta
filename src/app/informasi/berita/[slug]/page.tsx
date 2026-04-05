import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Calendar, Tag, Newspaper, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import KomentarSection from './KomentarSection'
import { fetchBeritaLainnya, fetchKomentar } from '@/app/actions/berita.actions'

// Generate Metadata Dinamis per Artikel (Penting untuk SEO!)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: berita } = await supabase
    .from('berita')
    .select('judul, konten, thumbnail_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!berita) return { title: 'Artikel Tidak Ditemukan' }

  // Bersihkan HTML dari konten untuk dijadikan deskripsi
  const deskripsi = berita.konten
    ?.replace(/<[^>]*>/g, '')
    ?.slice(0, 160) || ''

  return {
    title: berita.judul,
    description: deskripsi,
    openGraph: {
      title: berita.judul,
      description: deskripsi,
      images: berita.thumbnail_url ? [berita.thumbnail_url] : [],
      type: 'article',
    },
  }
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: berita } = await supabase
    .from('berita')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!berita) {
    notFound()
  }

  // Fetch Paralel untuk list Komentar dan Berita Sidebar
  const [komentarList, beritaLainnya] = await Promise.all([
    fetchKomentar(berita.id),
    fetchBeritaLainnya(berita.id, 5)
  ])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <section className="py-24 px-4 md:px-6 container mx-auto max-w-7xl relative z-10 w-full">
        
        {/* Navigasi Kembali */}
        <Link href="/informasi/berita" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition-colors mb-8 bg-white px-4 py-2 rounded-lg border border-slate-200 hover:border-brand-500 shadow-sm">
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Indeks Berita</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: ARTIKEL & KOMENTAR (70%) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Artikel Kontainer */}
            <article className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header Artikel */}
              <div className="p-8 md:p-12 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-2 bg-brand-50 text-brand-600 px-3 py-1 rounded-lg"><Tag className="w-4 h-4" /> {berita.kategori}</span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent-500" /> 
                    {new Date(berita.published_at || berita.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-8">
                  {berita.judul}
                </h1>
              </div>

              {/* Hero Image Artikel */}
              {berita.thumbnail_url ? (
                <div className="w-full aspect-video bg-slate-100 relative">
                  <img src={berita.thumbnail_url} alt={berita.judul} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full aspect-video bg-brand-50 flex items-center justify-center">
                  <Newspaper className="w-20 h-20 text-brand-200" />
                </div>
              )}

              {/* Isi Konten HTML */}
              <div 
                className="p-8 md:p-12 prose prose-slate md:prose-lg max-w-none text-slate-600"
                dangerouslySetInnerHTML={{ __html: berita.konten }}
              />
            </article>

            {/* Area Komentar */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">
              <KomentarSection 
                beritaId={berita.id} 
                komentarList={komentarList} 
                urlPath={`/informasi/berita/${slug}`} 
              />
            </div>

          </div>

          {/* KOLOM KANAN: SIDEBAR BERITA LAINNYA (30%) */}
          <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 sticky top-24">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-2 h-6 bg-brand-500 rounded-full shrink-0"></span>
              Berita Lainnya
            </h3>
            
            <div className="space-y-6">
              {beritaLainnya.length > 0 ? (
                beritaLainnya.map((item) => (
                  <Link key={item.id} href={`/informasi/berita/${item.slug}`} className="group flex gap-4 items-start border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <div className="w-24 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                      {item.thumbnail_url ? (
                        <img src={item.thumbnail_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <Newspaper className="w-8 h-8 text-slate-300 mx-auto mt-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors mb-2">
                        {item.judul}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium tracking-wide border-l-2 border-accent-400 pl-2">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">Tidak ada berita lain saat ini.</p>
              )}
            </div>
            
            <Link href="/informasi/berita" className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 text-slate-600 font-bold rounded-xl transition-colors border border-slate-100">
              <span>Ke Indeks Berita</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </aside>

        </div>
      </section>
    </div>
  )
}
