'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import { createPrestasi } from '@/app/actions/prestasi.actions'
import ImageUploader from '@/components/editor/ImageUploader'

export default function BaruPrestasiPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [fotoUrl, setFotoUrl] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('foto_url', fotoUrl)

    startTransition(async () => {
      const result = await createPrestasi(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/kesiswaan/prestasi"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Tambah Prestasi</h2>
          <p className="text-slate-500 text-sm mt-0.5">Catat penghargaan yang diraih siswa/sekolah</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-semibold text-slate-900 mb-2">Foto / Bukti Penghargaan</h3>
              <div className="aspect-[4/3] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                <ImageUploader value={fotoUrl} onChange={setFotoUrl} />
              </div>
              <p className="text-xs text-slate-500 text-center">Format: JPG, PNG. Rekomendasi 4:3 (Landscape).</p>
            </div>

            <div className="md:col-span-3 space-y-5">
              <div className="space-y-2">
                <label htmlFor="nama_prestasi" className="text-sm font-semibold text-slate-700">
                  Nama Prestasi / Lomba <span className="text-red-500">*</span>
                </label>
                <input
                  id="nama_prestasi"
                  name="nama_prestasi"
                  type="text"
                  required
                  placeholder="Contoh: Juara 1 Lomba Cerdas Cermat"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nama_siswa" className="text-sm font-semibold text-slate-700">
                  Nama Peraih (Siswa/Tim/Sekolah) <span className="text-red-500">*</span>
                </label>
                <input
                  id="nama_siswa"
                  name="nama_siswa"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso (Kelas 9A)"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="kategori" className="text-sm font-semibold text-slate-700">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="kategori"
                    name="kategori"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Non-Akademik">Non-Akademik / Ekskul</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="tingkat" className="text-sm font-semibold text-slate-700">
                    Tingkat <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tingkat"
                    name="tingkat"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  >
                    <option value="Sekolah">Tingkat Sekolah</option>
                    <option value="Kecamatan">Tingkat Kecamatan</option>
                    <option value="Kabupaten">Tingkat Kabupaten</option>
                    <option value="Provinsi">Tingkat Provinsi</option>
                    <option value="Nasional">Tingkat Nasional</option>
                    <option value="Internasional">Tingkat Internasional</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tahun" className="text-sm font-semibold text-slate-700">
                  Tahun Perolehan <span className="text-red-500">*</span>
                </label>
                <input
                  id="tahun"
                  name="tahun"
                  type="number"
                  required
                  defaultValue={new Date().getFullYear()}
                  min={1990}
                  max={2100}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                />
              </div>

            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <Link
            href="/dashboard/kesiswaan/prestasi"
            className="px-6 py-3 rounded-xl font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex-1 text-center"
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
                <Save className="w-5 h-5" /> Simpan Data Prestasi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
