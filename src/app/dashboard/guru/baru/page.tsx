'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import { createGuru } from '@/app/actions/guru.actions'
import ImageUploader from '@/components/editor/ImageUploader'

export default function BaruGuruPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [fotoUrl, setFotoUrl] = useState('')
  const [aktif, setAktif] = useState(true)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('foto_url', fotoUrl)
    formData.set('aktif', aktif.toString())

    startTransition(async () => {
      const result = await createGuru(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/guru"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Tambah Data Pegawai</h2>
          <p className="text-slate-500 text-sm mt-0.5">Input informasi untuk Guru & Tenaga Kependidikan baru</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
              <h3 className="font-semibold text-slate-900 mb-2">Foto Profil</h3>
              <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                <ImageUploader value={fotoUrl} onChange={setFotoUrl} />
              </div>
              <p className="text-xs text-slate-500 text-center">Format: JPG, PNG. Rekomendasi 3:4 (Portrait).</p>
            </div>

            <div className="md:col-span-3 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="nama" className="text-sm font-semibold text-slate-700">
                    Nama Lengkap & Gelar <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso, S.Pd."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="nip" className="text-sm font-semibold text-slate-700">NIP <span className="text-xs text-slate-400 font-normal">(Opsional)</span></label>
                  <input
                    id="nip"
                    name="nip"
                    type="text"
                    placeholder="Masukkan NIP jika ada..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="tipe" className="text-sm font-semibold text-slate-700">
                    Tipe Pegawai <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tipe"
                    name="tipe"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  >
                    <option value="guru">Guru (Pendidik)</option>
                    <option value="tendik">Tenaga Kependidikan (Staf/TU)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="jabatan" className="text-sm font-semibold text-slate-700">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="jabatan"
                    name="jabatan"
                    type="text"
                    required
                    placeholder="Wali Kelas, Staf TU, dll."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="mata_pelajaran" className="text-sm font-semibold text-slate-700">Mata Pelajaran <span className="text-xs text-slate-400 font-normal">(Khusus Guru)</span></label>
                  <input
                    id="mata_pelajaran"
                    name="mata_pelajaran"
                    type="text"
                    placeholder="Contoh: Matematika, IPA"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="pendidikan_terakhir" className="text-sm font-semibold text-slate-700">Pendidikan Terakhir</label>
                  <input
                    id="pendidikan_terakhir"
                    name="pendidikan_terakhir"
                    type="text"
                    placeholder="Contoh: S1 Pendidikan Matematika"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="space-y-2">
                   <label htmlFor="urutan" className="text-sm font-semibold text-slate-700">Urutan Tampil <span className="text-xs text-slate-400 font-normal">(Makin kecil makin atas)</span></label>
                   <input
                     id="urutan"
                     name="urutan"
                     type="number"
                     placeholder="0"
                     defaultValue="0"
                     className="w-32 px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                   />
                </div>
              
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors w-fit pr-6">
                  <input 
                    type="checkbox" 
                    checked={aktif}
                    onChange={(e) => setAktif(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600 focus:ring-2"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Status Aktif</p>
                    <p className="text-xs text-slate-500">Tampilkan data ini ke publik</p>
                  </div>
                </label>
              </div>

            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <Link
            href="/dashboard/guru"
            className="px-6 py-3 rounded-xl font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex-1 text-center max-w-[200px]"
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
                <Save className="w-5 h-5" /> Simpan Data Pegawai
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
