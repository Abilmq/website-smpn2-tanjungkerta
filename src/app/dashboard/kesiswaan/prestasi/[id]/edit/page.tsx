'use client'

import { useState, useTransition, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import { fetchPrestasiById, updatePrestasi } from '@/app/actions/prestasi.actions'
import ImageUploader from '@/components/editor/ImageUploader'

export default function EditPrestasiPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [namaPrestasi, setNamaPrestasi] = useState('')
  const [namaSiswa, setNamaSiswa] = useState('')
  const [kategori, setKategori] = useState('Akademik')
  const [tingkat, setTingkat] = useState('Sekolah')
  const [tahun, setTahun] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPrestasiById(id)
        if (data) {
          setNamaPrestasi(data.nama_prestasi)
          setNamaSiswa(data.nama_siswa)
          setKategori(data.kategori)
          setTingkat(data.tingkat)
          setTahun(data.tahun.toString())
          setFotoUrl(data.foto_url || '')
        } else {
          setError('Data prestasi tidak ditemukan.')
        }
      } catch (err) {
        setError('Gagal memuat data prestasi.')
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

    startTransition(async () => {
      const result = await updatePrestasi(id, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-4" />
        <p className="text-slate-500">Memuat detail prestasi...</p>
      </div>
    )
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
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Edit Data Prestasi</h2>
          <p className="text-slate-500 text-sm mt-0.5">Ubah rincian penghargaan yang tercatat</p>
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
                  value={namaPrestasi}
                  onChange={(e) => setNamaPrestasi(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nama_siswa" className="text-sm font-semibold text-slate-700">
                  Nama Peraih <span className="text-red-500">*</span>
                </label>
                <input
                  id="nama_siswa"
                  name="nama_siswa"
                  type="text"
                  required
                  value={namaSiswa}
                  onChange={(e) => setNamaSiswa(e.target.value)}
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
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
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
                    value={tingkat}
                    onChange={(e) => setTingkat(e.target.value)}
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
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
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
                <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan Perubahan...
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
