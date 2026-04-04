'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, Save, Loader2, X } from 'lucide-react'
import { updateBerita } from '@/app/actions/berita.actions'
import ImageUploader from '@/components/editor/ImageUploader'

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-slate-200 rounded-xl min-h-[300px] flex items-center justify-center bg-slate-50">
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  )
})

const KATEGORI_OPTIONS = ['Umum', 'Prestasi', 'Akademik', 'Kegiatan', 'Pengumuman']

interface EditBeritaFormProps {
  berita: {
    id: string
    judul: string
    konten: string
    kategori: string
    published: boolean
    thumbnail_url: string | null
  }
}

export default function EditBeritaForm({ berita }: EditBeritaFormProps) {
  const [isPending, startTransition] = useTransition()
  const [konten, setKonten] = useState(berita.konten)
  const [published, setPublished] = useState(berita.published)
  const [thumbnailUrl, setThumbnailUrl] = useState(berita.thumbnail_url || '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('konten', konten)
    formData.set('published', published.toString())
    formData.set('thumbnail_url', thumbnailUrl)

    startTransition(async () => {
      const result = await updateBerita(berita.id, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/berita" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Edit Berita</h2>
          <p className="text-slate-500 text-sm mt-0.5 line-clamp-1">{berita.judul}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Judul */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-2">
              <label htmlFor="judul" className="text-sm font-semibold text-slate-700">Judul Berita <span className="text-red-500">*</span></label>
              <input
                id="judul"
                name="judul"
                type="text"
                required
                defaultValue={berita.judul}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none text-lg font-medium"
              />
            </div>

            {/* Editor */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
              <label className="text-sm font-semibold text-slate-700">Konten Berita <span className="text-red-500">*</span></label>
              <RichTextEditor content={berita.konten} onChange={setKonten} />
            </div>
          </div>

          <div className="space-y-4">
            {/* Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h3 className="font-semibold text-slate-900">Pengaturan</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setPublished(false)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${!published ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                    Draft
                  </button>
                  <button type="button" onClick={() => setPublished(true)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${published ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                    Publish
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="kategori" className="text-sm font-medium text-slate-700">Kategori</label>
                <select id="kategori" name="kategori" defaultValue={berita.kategori}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white outline-none text-sm">
                  {KATEGORI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <button type="submit" disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-xl transition-colors shadow-sm">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <ImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
