'use client'

import { useState, useTransition, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import { fetchEkskulById, updateEkskul } from '@/app/actions/ekskul.actions'
import ImageUploader from '@/components/editor/ImageUploader'

export default function EditEkskulPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [nama, setNama] = useState('')
  const [pembina, setPembina] = useState('')
  const [jadwal, setJadwal] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [aktif, setAktif] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEkskulById(id)
        if (data) {
          setNama(data.nama)
          setPembina(data.pembina || '')
          setJadwal(data.jadwal || '')
          setDeskripsi(data.deskripsi || '')
          setFotoUrl(data.foto_url || '')
          setAktif(data.aktif)
        } else {
          setError('Data ekstrakurikuler tidak ditemukan.')
        }
      } catch (err) {
        setError('Gagal memuat data.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('foto_url', fotoUrl)
    formData.set('aktif', aktif.toString())

    startTransition(async () => {
      const result = await updateEkskul(id, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-4" />
        <p className="text-slate-500">Memuat detail ekstrakurikuler...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/kesiswaan/ekskul"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Edit Ekstrakurikuler</h2>
          <p className="text-slate-500 text-sm mt-0.5">Ubah informasi ekskul yang sudah diinput</p>
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
              <h3 className="font-semibold text-slate-900 mb-2">Logo / Foto Kegiatan</h3>
              <div className="aspect-square w-full max-w-xs mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                <ImageUploader value={fotoUrl} onChange={setFotoUrl} />
              </div>
            </div>

            <div className="md:col-span-3 space-y-5">
              <div className="space-y-2">
                <label htmlFor="nama" className="text-sm font-semibold text-slate-700">
                  Nama Ekstrakurikuler <span className="text-red-500">*</span>
                </label>
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="pembina" className="text-sm font-semibold text-slate-700">Nama Pembina</label>
                  <input
                    id="pembina"
                    name="pembina"
                    type="text"
                    value={pembina}
                    onChange={(e) => setPembina(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="jadwal" className="text-sm font-semibold text-slate-700">Jadwal Latihan</label>
                  <input
                    id="jadwal"
                    name="jadwal"
                    type="text"
                    value={jadwal}
                    onChange={(e) => setJadwal(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="deskripsi" className="text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  rows={4}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={aktif}
                  onChange={(e) => setAktif(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600 focus:ring-2"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Status Aktif</p>
                  <p className="text-xs text-slate-500">Tampilkan ekskul ini ke publik</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <Link
            href="/dashboard/kesiswaan/ekskul"
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
                <Save className="w-5 h-5" /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
