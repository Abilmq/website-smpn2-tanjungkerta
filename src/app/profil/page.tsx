import PageHeader from '@/components/ui/PageHeader'
import Link from 'next/link'
import { fetchProfilSekolah } from '@/app/actions/profil.actions'
import { History, Users, MessageSquareQuote, ArrowRight, Lightbulb, Target } from 'lucide-react'

export const revalidate = 60

export default async function ProfilUtamaPage() {
  const profil = await fetchProfilSekolah()

  // Ekstrak teks bersih (tanpa HTML) untuk sinopsis sejarah
  const sejarahClean = profil?.sejarah?.replace(/<[^>]+>/g, '') || ''
  const sejarahSnippet = sejarahClean.length > 200 ? sejarahClean.substring(0, 200) + '...' : (sejarahClean || 'Jelajahi sejarah panjang dan landasan berdirinya SMPN 2 Tanjungkerta dari awal mula berdiri hingga saat ini.')

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Profil Sekolah" 
        description="Mengenal lebih dekat wajah, lingkungan, dan elemen inti dari SMP Negeri 2 Tanjungkerta."
        crumbs={[
          { label: 'Profil' }
        ]} 
      />

      <section className="py-20 md:py-32 px-4 md:px-6 container mx-auto max-w-6xl relative z-10 w-full space-y-20">
        
        {/* Rangkuman Singkat & Intro */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 font-bold text-sm tracking-wide uppercase mb-4">
            <Target className="w-4 h-4" />
            <span>Etalase Utama</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            Menuju Pendidikan Karakter dan Inovasi Berkualitas
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Ini adalah gerbang informasi utama untuk mengeksplorasi latar belakang, struktur organisasi, dan pandangan masa depan SMP Negeri 2 Tanjungkerta. 
            Silakan pilih menu spesifik di bawah ini untuk menyelami lebih dalam struktur institusi kami.
          </p>
        </div>

        {/* Direktori Navigasi Profil (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Card Sejarah & Visi Misi */}
          <Link href="/profil/sejarah" className="group">
            <div className="h-full bg-white relative rounded-3xl p-8 border border-slate-200 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col items-start overflow-hidden hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-6 sibling">
                <History className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Sejarah & Visi Misi</h3>
              <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                {sejarahSnippet}
              </p>
              <div className="flex items-center gap-2 font-bold text-brand-600 mt-auto group-hover:text-brand-500">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card Sambutan Kepala Sekolah */}
          <Link href="/profil/sambutan" className="group">
            <div className="h-full bg-white relative rounded-3xl p-8 border border-slate-200 hover:border-accent-300 hover:shadow-xl hover:shadow-accent-500/10 transition-all duration-300 flex flex-col items-start overflow-hidden hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquareQuote className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Sambutan Kepala Sekolah</h3>
              <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                Simak arahan, harapan, dan komitmen kepala sekolah dalam membimbing jalannya roda pendidikan di sekolah kami tercinta.
              </p>
              <div className="flex items-center gap-2 font-bold text-accent-600 mt-auto group-hover:text-accent-500">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card Direktori Guru & Staff */}
          <Link href="/profil/guru" className="group md:col-span-2 lg:col-span-1">
            <div className="h-full bg-white relative rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col items-start overflow-hidden hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Direktori Guru & Staff</h3>
              <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                Data para pendidik dan tenaga kependidikan profesional yang telah berdedikasi tinggi mencerdaskan peserta didik dengan penuh integritas.
              </p>
              <div className="flex items-center gap-2 font-bold text-emerald-600 mt-auto group-hover:text-emerald-500">
                <span>Lihat Daftar Staff</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>

      </section>
    </div>
  )
}
