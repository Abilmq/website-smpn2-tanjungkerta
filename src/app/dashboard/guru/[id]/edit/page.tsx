'use client'

import { useState, useTransition, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import { fetchGuruById, updateGuru } from '@/app/actions/guru.actions'
import ImageUploader from '@/components/editor/ImageUploader'

export default function EditGuruPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [nama, setNama] = useState('')
  const [nip, setNip] = useState('')
  const [tipe, setTipe] = useState('guru')
  const [jabatan, setJabatan] = useState('')
  const [mataPelajaran, setMataPelajaran] = useState('')
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState('')
  const [urutan, setUrutan] = useState('0')
  const [fotoUrl, setFotoUrl] = useState('')
  const [aktif, setAktif] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGuruById(id)
        if (data) {
          setNama(data.nama)
          setNip(data.nip || '')
          setTipe(data.tipe)
          setJabatan(data.jabatan || '')
          setMataPelajaran(data.mata_pelajaran || '')
          setPendidikanTerakhir(data.pendidikan_terakhir || '')
          setUrutan(data.urutan?.toString() || '0')
          setFotoUrl(data.foto_url || '')
          setAktif(data.aktif)
        } else {
          setError('Data pegawai tidak ditemukan.')
        }
      } catch (err) {
        setError('Gagal memuat data pegawai.')
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
      const result = await updateGuru(id, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-4" />
        <p className="text-slate-500">Memuat detail pegawai...</p>
      </div>
    )
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
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Edit Data Pegawai</h2>
          <p className="text-slate-500 text-sm mt-0.5">Ubah informasi Guru & Tenaga Kependidikan</p>
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
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="nip" className="text-sm font-semibold text-slate-700">NIP</label>
                  <input
                    id="nip"
                    name="nip"
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
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
                    value={tipe}
                    onChange={(e) => setTipe(e.target.value)}
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
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="mata_pelajaran" className="text-sm font-semibold text-slate-700">Mata Pelajaran <span className="text-xs text-slate-400 font-normal">(Guru)</span></label>
                  <input
                    id="mata_pelajaran"
                    name="mata_pelajaran"
                    type="text"
                    value={mataPelajaran}
                    onChange={(e) => setMataPelajaran(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="pendidikan_terakhir" className="text-sm font-semibold text-slate-700">Pendidikan Terakhir</label>
                  <input
                    id="pendidikan_terakhir"
                    name="pendidikan_terakhir"
                    type="text"
                    value={pendidikanTerakhir}
                    onChange={(e) => setPendidikanTerakhir(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="space-y-2">
                   <label htmlFor="urutan" className="text-sm font-semibold text-slate-700">Urutan Tampil</label>
                   <input
                     id="urutan"
                     name="urutan"
                     type="number"
                     value={urutan}
                     onChange={(e) => setUrutan(e.target.value)}
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
