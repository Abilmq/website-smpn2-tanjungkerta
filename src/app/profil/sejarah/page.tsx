import PageHeader from '@/components/ui/PageHeader'
import { fetchProfilSekolah } from '@/app/actions/profil.actions'
import { Target, Lightbulb, History } from 'lucide-react'

export const revalidate = 60 // Revalidate cache setiap 60 detik

export default async function SejarahPage() {
  const profil = await fetchProfilSekolah()

  const sejarahHtml = (profil?.sejarah || '<p class="text-slate-500 italic">Belum ada data sejarah.</p>').replace(/&nbsp;/g, ' ')
  const visiHtml = (profil?.visi || '<p class="text-slate-500 italic">Belum ada data visi.</p>').replace(/&nbsp;/g, ' ')
  const misiHtml = (profil?.misi || '<p class="text-slate-500 italic">Belum ada data misi.</p>').replace(/&nbsp;/g, ' ')

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans overflow-hidden">
      <PageHeader
        title="Sejarah, Visi & Misi"
        description="Mengenal lebih dekat identitas, tujuan luhur, dan landasan pergerakan SMP Negeri 2 Tanjungkerta."
        crumbs={[
          { label: 'Profil', href: '#' },
          { label: 'Sejarah & Visi Misi' }
        ]}
      />

      <section className="py-24 px-4 md:px-6 container mx-auto max-w-5xl relative z-10 space-y-12 w-full">

        {/* Sejarah Section */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 w-full overflow-hidden">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="p-3 bg-brand-100 rounded-xl text-brand-600">
              <History className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Sejarah Institusi</h2>
          </div>
          <div
            className="prose prose-slate md:prose-lg max-w-none prose-headings:text-brand-900 prose-a:text-accent-600 break-words whitespace-normal"
            dangerouslySetInnerHTML={{ __html: sejarahHtml }}
          />
        </div>

        {/* Visi Misi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

          {/* Visi */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 w-full overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-accent-100 rounded-xl text-accent-600">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Visi</h2>
            </div>
            <div
              className="prose prose-slate max-w-none break-words whitespace-normal"
              dangerouslySetInnerHTML={{ __html: visiHtml }}
            />
          </div>

          {/* Misi */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 w-full overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Misi</h2>
            </div>
            <div
              className="prose prose-slate max-w-none break-words whitespace-normal"
              dangerouslySetInnerHTML={{ __html: misiHtml }}
            />
          </div>

        </div>

      </section>
    </div>
  )
}
