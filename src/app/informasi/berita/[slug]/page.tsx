import PageHeader from '@/components/ui/PageHeader'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Newspaper } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Detail Berita" 
        crumbs={[
          { label: 'Informasi', href: '/informasi/berita' },
          { label: 'Berita', href: '/informasi/berita' },
          { label: 'Detail' }
        ]} 
      />

      <section className="py-24 px-4 md:px-6 container mx-auto max-w-4xl relative z-10">
        
        {/* Navigasi Kembali */}
        <Link href="/informasi/berita" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition-colors mb-8 bg-white px-4 py-2 rounded-lg border border-slate-200 hover:border-brand-500 shadow-sm">
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Indeks Berita</span>
        </Link>
        
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

          {/* Isi Konten */}
          <div 
            className="p-8 md:p-12 prose prose-slate md:prose-lg max-w-none text-slate-600"
            dangerouslySetInnerHTML={{ __html: berita.konten }}
          />

        </article>

      </section>
    </div>
  )
}
