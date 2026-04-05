import PageHeader from '@/components/ui/PageHeader'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight, Newspaper } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Berita & Prestasi | SMPN 2 Tanjungkerta',
  description: 'Dokumentasi perjalanan akademik, non-akademik, dan torehan prestasi dari SMP Negeri 2 Tanjungkerta.',
}

export default async function BeritaPage() {
  const supabase = await createClient()

  const { data: beritaList } = await supabase
    .from('berita')
    .select('id, judul, slug, kategori, thumbnail_url, published_at, created_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(12)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Berita &amp; Prestasi Terbaru" 
        description="Dokumentasi perjalanan akademik, non-akademik, dan beragam torehan prestasi luar biasa dari warga SMP Negeri 2 Tanjungkerta."
        crumbs={[
          { label: 'Informasi', href: '#' },
          { label: 'Berita' }
        ]} 
      />

      <section className="py-24 px-4 md:px-6 container mx-auto max-w-6xl relative z-10">

        {/* Grid Artikel */}
        {beritaList && beritaList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beritaList.map((berita) => (
              <Link href={`/informasi/berita/${berita.slug}`} key={berita.id} className="flex flex-col group p-6 relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-500 transition-all hover:-translate-y-1">
                <div className="bg-slate-100 rounded-xl mb-6 relative overflow-hidden aspect-video">
                  {berita.thumbnail_url ? (
                    <div className="relative w-full h-full">
                      <Image src={berita.thumbnail_url} fill className="object-cover" alt={berita.judul} sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-50">
                      <Newspaper className="w-12 h-12 text-brand-300" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest shadow-sm">{berita.kategori}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider relative pl-4 before:content-[''] before:w-1.5 before:h-1.5 before:bg-accent-500 before:absolute before:left-0 before:top-1.5 before:rounded-sm">
                  {new Date(berita.published_at || berita.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-brand-600 transition-colors">
                  {berita.judul}
                </h3>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-brand-600 font-bold text-sm">
                  Baca Selengkapnya
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <Newspaper className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Belum Ada Berita</h3>
            <p className="text-slate-500 max-w-md">Berita dan informasi terbaru dari sekolah akan ditampilkan di sini.</p>
          </div>
        )}

      </section>
    </div>
  )
}
