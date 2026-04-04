'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, X, AlertCircle } from 'lucide-react'
import { createPengumuman } from '@/app/actions/pengumuman.actions'

export default function BaruPengumumanPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [featured, setFeatured] = useState(false)
  const [aktif, setAktif] = useState(true)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('featured', featured.toString())
    formData.set('aktif', aktif.toString())

    startTransition(async () => {
      const result = await createPengumuman(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/pengumuman"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Tambah Pengumuman Baru</h2>
          <p className="text-slate-500 text-sm mt-0.5">Informasi penting akan ditampilkan di beranda / halaman informasi</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          {/* Judul */}
          <div className="space-y-2">
            <label htmlFor="judul" className="text-sm font-semibold text-slate-700">
              Judul Pengumuman <span className="text-red-500">*</span>
            </label>
            <input
              id="judul"
              name="judul"
              type="text"
              required
              placeholder="Contoh: Pendaftaran OSIS Periode 2026/2027"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* Konten Singkat */}
          <div className="space-y-2">
            <label htmlFor="konten" className="text-sm font-semibold text-slate-700">
              Isi Pengumuman <span className="text-red-500">*</span>
            </label>
            <textarea
              id="konten"
              name="konten"
              required
              rows={4}
              placeholder="Jelaskan detail dari pengumuman ini secara singkat dan padat..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none resize-none"
            />
            <p className="text-xs text-slate-500 text-right">Maksimal 300 karakter disarankan (Plain Text)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tanggal Berlaku */}
            <div className="space-y-2">
              <label htmlFor="tanggal_berlaku" className="text-sm font-semibold text-slate-700">
                Batas Tanggal Berlaku <span className="text-red-500">*</span>
              </label>
              <input
                id="tanggal_berlaku"
                name="tanggal_berlaku"
                type="date"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              />
              <p className="text-xs text-slate-500">
                Setelah tanggal ini, sistem akan menandainya kedaluwarsa.
              </p>
            </div>

            {/* Opsi Tampilan */}
            <div className="space-y-3 pt-1">
              <label className="text-sm font-semibold text-slate-700 block">Opsi Tambahan</label>
              
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-600 focus:ring-2"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Featured (Sematkan)</p>
                  <p className="text-xs text-slate-500">Muncul di posisi paling atas/penting</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={aktif}
                  onChange={(e) => setAktif(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600 focus:ring-2"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Status Aktif</p>
                  <p className="text-xs text-slate-500">Tampilkan ke pengunjung web sekarang</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Link
            href="/dashboard/pengumuman"
            className="px-6 py-3 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex-1 text-center"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-xl transition-colors shadow-sm shadow-brand-500/20"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Simpan Pengumuman
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
