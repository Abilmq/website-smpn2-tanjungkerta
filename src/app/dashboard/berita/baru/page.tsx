'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, Save, Loader2, X } from 'lucide-react'
import { createBerita } from '@/app/actions/berita.actions'
import ImageUploader from '@/components/editor/ImageUploader'

// Lazy load editor (SSR tidak kompatibel)
const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-slate-200 rounded-xl min-h-[300px] flex items-center justify-center bg-slate-50">
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  )
})

const KATEGORI_OPTIONS = ['Umum', 'Prestasi', 'Akademik', 'Kegiatan', 'Pengumuman']

export default function TulisBeritaPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [konten, setKonten] = useState('')
  const [published, setPublished] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('konten', konten)
    formData.set('published', published.toString())
    formData.set('thumbnail_url', thumbnailUrl)

    startTransition(async () => {
      const result = await createBerita(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/berita"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Tulis Berita Baru</h2>
          <p className="text-slate-500 text-sm mt-0.5">Buat artikel berita untuk ditampilkan di website</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Konten Utama */}
          <div className="lg:col-span-2 space-y-5">
            {/* Judul */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-2">
              <label htmlFor="judul" className="text-sm font-semibold text-slate-700">
                Judul Berita <span className="text-red-500">*</span>
              </label>
              <input
                id="judul"
                name="judul"
                type="text"
                required
                placeholder="Masukkan judul berita yang menarik..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white bg-slate-50 transition-all outline-none text-lg font-medium"
              />
            </div>

            {/* Editor Konten */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Konten Berita <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content=""
                onChange={setKonten}
                placeholder="Tulis konten berita di sini..."
              />
            </div>
          </div>

          {/* Kolom Sidebar Pengaturan */}
          <div className="space-y-4">
            {/* Pengaturan Publish */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h3 className="font-semibold text-slate-900">Pengaturan</h3>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPublished(false)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      !published
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublished(true)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      published
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Publish
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {published ? '✅ Berita akan langsung tampil di website.' : '📋 Tersimpan sebagai draft, tidak tampil di website.'}
                </p>
              </div>

              {/* Kategori */}
              <div className="space-y-2">
                <label htmlFor="kategori" className="text-sm font-medium text-slate-700">Kategori</label>
                <select
                  id="kategori"
                  name="kategori"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none text-sm"
                >
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              {/* Tombol Simpan */}
              <button
                type="submit"
                disabled={isPending || !konten || konten === '<p></p>'}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-xl transition-colors shadow-sm shadow-brand-500/20"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isPending ? 'Menyimpan...' : published ? 'Simpan & Publish' : 'Simpan Draft'}
              </button>
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <ImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} />
              <p className="text-xs text-slate-400 mt-2">Format: JPG, PNG, WebP. Rekomendasi 16:9.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
