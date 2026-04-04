import Link from 'next/link'
import { ArrowRight, BookOpen, Trophy, ArrowUpRight, Target, Lightbulb, Calendar, Image as ImageIcon } from 'lucide-react'
import RunningText from '@/components/ui/RunningText'
import { fetchProfilSekolah } from '@/app/actions/profil.actions'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export const revalidate = 60

export default async function Home() {
  const profil = await fetchProfilSekolah()
  const visiHtml = (profil?.visi || '<p class="text-slate-400">Belum ada data visi.</p>').replace(/&nbsp;/g, ' ')
  const misiHtml = (profil?.misi || '<p class="text-slate-400">Belum ada data misi.</p>').replace(/&nbsp;/g, ' ')

  const supabase = await createClient()
  const { data: beritaList } = await supabase
    .from('berita')
    .select('id, judul, slug, thumbnail_url, kategori, created_at, konten')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const slogans = [
    "MEMBANGUN GENERASI BERAKHLAK MULIA",
    "MERDEKA BELAJAR UNTUK MASA DEPAN CERAH",
    "SEKOLAH RAMAH ANAK TERAKREDITASI A"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-transparent font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (Tegas, Premium, Clean Grid) */}
      <section className="relative pt-32 pb-48 px-4 md:px-6 z-0 bg-background overflow-hidden flex flex-col items-start justify-center min-h-[90vh]">
        
        {/* Latar Belakang Foto Lingkungan */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/Foto-lingkungan.jpg)' }}
        >
          {/* Overlay putih semi-transparan & gradasi dari kiri agar teks rata kiri tetap terbaca sangat jelas */}
          <div className="absolute inset-0 bg-white/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 text-left flex flex-col items-start mt-10">
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter text-left mb-8 leading-[1] md:leading-[0.9] drop-shadow-sm">
            SMPN <span className="text-brand-600">2</span><br className="hidden md:block" />
            <span className="relative inline-block z-0 text-slate-900 border-b-8 border-accent-500 pb-2">Tanjungkerta</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-600 max-w-2xl text-left mb-12 font-medium leading-relaxed">
            Membentuk karakter, mengedepankan prestasi, dan membangun ekosistem kolaborasi untuk standar pendidikan setara global.
          </p>
          
          {/* Tombol Kapsul -> Rounded-xl Tegas */}
          <div className="flex flex-col sm:flex-row gap-4 items-start w-full sm:w-auto">
            <Link 
              href="/profil" 
              className="px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-slate-900 shadow-lg shadow-accent-500/20 group text-base md:text-lg w-full sm:w-auto hover:-translate-y-1"
            >
              Kenali Sekolah Kami
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/informasi/berita" 
              className="px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center justify-center gap-2 bg-white text-brand-600 border-2 border-brand-100 hover:border-brand-600 transition-colors text-base md:text-lg w-full sm:w-auto hover:-translate-y-1"
            >
              Berita & Prestasi
            </Link>
          </div>
        </div>
      </section>

      {/* 2. RUNNING TEXT / TICKER (Warna Kuning Aksen) */}
      <div className="relative -mt-6 md:-mt-8 z-20">
        <RunningText items={slogans} bgClass="bg-accent-500 shadow-md border-y border-accent-600/30" textClass="text-slate-900 font-bold tracking-wide" />
      </div>

      {/* 3. SAMBUTAN KEPALA SEKOLAH (2 Columns, Grid/Kotak Tegas) */}
      <section className="py-24 px-4 md:px-6 z-10 relative bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            
            {/* Foto Persegi Tegas dengan Offset Solid (Mondrian Lite) */}
            <div className="order-2 lg:order-1 flex justify-center relative">
              <div className="absolute top-6 -left-6 w-full h-full bg-brand-100 rounded-2xl z-0"></div>
              <div className="absolute -bottom-4 right-4 w-32 h-32 bg-accent-400 rounded-tl-3xl rounded-br-2xl z-0"></div>
              <div className="w-[100%] max-w-[400px] aspect-[3/4] relative rounded-2xl overflow-hidden shadow-xl z-10 bg-slate-200 border border-slate-100">
                {/* Fallback Image jika komponen MaskedImage ditiadakan, kita bisa gunakan Image standard atau biarkan MaskedImage dengan maskType square */}
                <img src="/placeholder-hero.jpg" alt="Kepala Sekolah SMPN 2 Tanjungkerta" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* High Contrast Typography Text Block */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1.5 bg-brand-600"></div>
                <span className="font-bold text-brand-600 tracking-widest uppercase text-sm">Sambutan Kepala Sekolah</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Mengukir Prestasi, <br/>Membangun Budi Pekerti
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Selamat datang di warta digital institusi kami. Kami senantiasa berkomitmen untuk memberikan layanan pendidikan yang progresif dan adaptif. Bukan sekadar mengejar angka akademis, melainkan menempa karakter para tunas bangsa agar siap menjadi pilar masa depan yang berintegritas.
              </p>
              <div className="pt-4">
                <Link href="/profil/sambutan" className="inline-flex items-center gap-2 font-bold text-brand-600 hover:text-brand-800 transition-colors py-2 border-b-2 border-brand-500 text-lg">
                  Baca Sambutan Lengkap <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. VISI & MISI SEKOLAH */}
      <section className="relative py-32 px-4 md:px-6 bg-brand-50 text-slate-900 overflow-hidden [clip-path:polygon(0_0,100%_4vw,100%_100%,0_calc(100%-4vw))]">
        <div className="absolute inset-0 bg-dots z-0 opacity-50"></div>

        <div className="container mx-auto max-w-6xl relative z-10 py-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight text-slate-900">Visi & Misi</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">Landasan filosofis yang menjadi navigasi utama arah tujuan institusi pendidikan SMPN 2 Tanjungkerta.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            
            {/* Visi */}
            <div className="relative group text-center md:text-left flex flex-col items-center md:items-start bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 rounded-2xl bg-accent-500 flex items-center justify-center mb-6 text-slate-900">
                <Lightbulb className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-4 text-slate-900">Visi</h3>
              <div 
                className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium break-words whitespace-normal"
                dangerouslySetInnerHTML={{ __html: visiHtml }}
              />
            </div>

            {/* Misi */}
            <div className="relative group text-center md:text-left flex flex-col items-center md:items-start bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-4 text-slate-900">Misi</h3>
              <div 
                className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium break-words whitespace-normal"
                dangerouslySetInnerHTML={{ __html: misiHtml }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. ARTIKEL BERITA */}
      <section className="py-32 px-4 md:px-6 relative z-10 bg-white">
        
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16 border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight border-l-8 border-brand-600 pl-4">Artikel Berita</h2>
            </div>
            <Link href="/informasi/berita" className="px-6 py-3 rounded-lg font-bold transition-all inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-sm">
              Lihat Kumpulan Berita <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {beritaList && beritaList.length > 0 ? (
              beritaList.map((berita) => (
                <Link href={`/informasi/berita/${berita.slug}`} key={berita.id} className="flex flex-col group p-6 relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-500 transition-all hover:-translate-y-1">
                  <div className="bg-slate-100 rounded-xl mb-6 relative overflow-hidden aspect-video">
                    {berita.thumbnail_url ? (
                      <img src={berita.thumbnail_url} className="w-full h-full object-cover" alt={berita.judul} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-50">
                        <ImageIcon className="w-12 h-12 text-brand-300" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest shadow-sm">{berita.kategori}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider relative pl-4 before:content-[''] before:w-1.5 before:h-1.5 before:bg-accent-500 before:absolute before:left-0 before:top-1.5 before:rounded-sm">
                    {new Date(berita.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
                    {berita.judul}
                  </h3>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-brand-600 font-bold text-sm">
                    Baca Selengkapnya
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-500 font-medium">Belum ada artikel berita yang dipublikasikan.</p>
              </div>
            )}

          </div>
        </div>
      </section>

    </div>
  )
}
