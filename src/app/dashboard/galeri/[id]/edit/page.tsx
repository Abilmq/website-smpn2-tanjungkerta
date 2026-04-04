'use client'

import { useState, useTransition, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import { fetchGaleriById, updateGaleri } from '@/app/actions/galeri.actions'
import ImageUploader from '@/components/editor/ImageUploader'

export default function EditGaleriPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [kategori, setKategori] = useState('Kegiatan')
  const [tanggalKegiatan, setTanggalKegiatan] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGaleriById(id)
        if (data) {
          setJudul(data.judul)
          setDeskripsi(data.deskripsi || '')
          setMediaUrl(data.media_url)
          setKategori(data.kategori)
          if (data.tanggal_kegiatan) {
            setTanggalKegiatan(new Date(data.tanggal_kegiatan).toISOString().split('T')[0])
          }
        } else {
          setError('Data galeri tidak ditemukan.')
        }
      } catch (err) {
        setError('Gagal memuat data galeri.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!mediaUrl) {
      setError('Media (foto) wajib diunggah/diisi URL-nya.')
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('media_url', mediaUrl)

    startTransition(async () => {
      const result = await updateGaleri(id, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-4" />
        <p className="text-slate-500">Memuat rincian galeri...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/galeri"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Edit Detail Galeri</h2>
          <p className="text-slate-500 text-sm mt-0.5">Ubah informasi maupun gambar yang sudah diunggah</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-slate-900 mb-2">Media Foto <span className="text-red-500">*</span></h3>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center p-2 relative">
               <ImageUploader value={mediaUrl} onChange={setMediaUrl} />
            </div>
          </div>

          <div className="md:col-span-3 space-y-5">
            <div className="space-y-2">
              <label htmlFor="judul" className="text-sm font-semibold text-slate-700">
                Judul Foto/Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                id="judul"
                name="judul"
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="kategori" className="text-sm font-semibold text-slate-700">
                Pilih Kategori <span className="text-red-500">*</span>
              </label>
              <select
                id="kategori"
                name="kategori"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              >
                <option value="Kegiatan">Kegiatan Sekolah</option>
                <option value="Fasilitas">Fasilitas</option>
                <option value="Prestasi">Penghargaan / Prestasi</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tanggal_kegiatan" className="text-sm font-semibold text-slate-700">
                Tanggal Kegiatan/Pengambilan Foto
              </label>
              <input
                id="tanggal_kegiatan"
                name="tanggal_kegiatan"
                type="date"
                value={tanggalKegiatan}
                onChange={(e) => setTanggalKegiatan(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="deskripsi" className="text-sm font-semibold text-slate-700">
                Deskripsi Singkat (Opsional)
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none resize-none"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <Link
                href="/dashboard/galeri"
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
                    <Save className="w-5 h-5" /> Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
