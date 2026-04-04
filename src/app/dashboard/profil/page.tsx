'use client'

import { useState, useTransition, useEffect } from 'react'
import { Save, Loader2, AlertCircle, CheckCircle2, School, UserCircle, Image as ImageIcon } from 'lucide-react'
import { fetchProfilSekolah, saveProfilSekolah } from '@/app/actions/profil.actions'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/editor/ImageUploader'

const QuillNoSSRWrapper = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center animate-pulse"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>,
})

const quillModules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
}

export default function ProfilSekolahPage() {
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  const [sejarah, setSejarah] = useState('')
  const [visi, setVisi] = useState('')
  const [misi, setMisi] = useState('')
  const [strukturUrl, setStrukturUrl] = useState('')
  
  const [kepsekNama, setKepsekNama] = useState('')
  const [kepsekSambutan, setKepsekSambutan] = useState('')
  const [kepsekFotoUrl, setKepsekFotoUrl] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProfilSekolah()
        if (data) {
          setSejarah(data.sejarah || '')
          setVisi(data.visi || '')
          setMisi(data.misi || '')
          setStrukturUrl(data.struktur_organisasi_url || '')
          setKepsekNama(data.nama_kepsek || '')
          setKepsekSambutan(data.sambutan_kepsek || '')
          setKepsekFotoUrl(data.foto_kepsek || '')
        }
      } catch (err) {
        setError('Gagal memuat data profil sekolah')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    const formData = new FormData()
    formData.set('sejarah', sejarah)
    formData.set('visi', visi)
    formData.set('misi', misi)
    formData.set('struktur_organisasi_url', strukturUrl)
    formData.set('kepala_sekolah_nama', kepsekNama)
    formData.set('kepala_sekolah_sambutan', kepsekSambutan)
    formData.set('kepala_sekolah_foto_url', kepsekFotoUrl)

    startTransition(async () => {
      const result = await saveProfilSekolah(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccessMsg('Profil sekolah berhasil disimpan')
        setTimeout(() => setSuccessMsg(null), 3000)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-4" />
        <p className="text-slate-500">Memuat profil sekolah...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Profil Sekolah</h2>
          <p className="text-slate-500 mt-1">Kelola sejarah, visi misi, struktur organisasi dan info kepala sekolah</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Identitas & Sejarah */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-8">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <School className="w-5 h-5 text-brand-600" />
            Sejarah & Visi Misi
          </h3>
          
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 block">Sejarah Singkat SMPN 2 Tanjungkerta</label>
            <div className="prose-editor">
              <QuillNoSSRWrapper
                theme="snow"
                value={sejarah}
                onChange={setSejarah}
                modules={quillModules}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Visi Sekolah</label>
              <div className="prose-editor">
                <QuillNoSSRWrapper
                  theme="snow"
                  value={visi}
                  onChange={setVisi}
                  modules={quillModules}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Misi Sekolah</label>
              <div className="prose-editor">
                <QuillNoSSRWrapper
                  theme="snow"
                  value={misi}
                  onChange={setMisi}
                  modules={quillModules}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kepala Sekolah */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-8">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <UserCircle className="w-5 h-5 text-brand-600" />
            Informasi Kepala Sekolah
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Foto Kepala Sekolah</label>
              <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center p-2 relative">
                 <ImageUploader value={kepsekFotoUrl} onChange={setKepsekFotoUrl} folder="profil" />
              </div>
            </div>
            
            <div className="md:col-span-3 space-y-5">
              <div className="space-y-2">
                <label htmlFor="kepala_sekolah_nama" className="text-sm font-semibold text-slate-700">Nama Lengkap & Gelar</label>
                <input
                  id="kepala_sekolah_nama"
                  name="kepala_sekolah_nama"
                  type="text"
                  value={kepsekNama}
                  onChange={(e) => setKepsekNama(e.target.value)}
                  placeholder="Bapak/Ibu Kepala Sekolah..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Kata Sambutan</label>
                <textarea
                  rows={6}
                  value={kepsekSambutan}
                  onChange={(e) => setKepsekSambutan(e.target.value)}
                  placeholder="Tuliskan kata sambutan singkat dari Kepala Sekolah..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Struktur Organisasi */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <ImageIcon className="w-5 h-5 text-brand-600" />
            Struktur Organisasi Sekolah
          </h3>
          <div className="max-w-xl space-y-4">
            <label className="text-sm font-semibold text-slate-700 block">Bagan/Grafik Struktur Organisasi</label>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center p-2 relative">
               <ImageUploader value={strukturUrl} onChange={setStrukturUrl} folder="profil" />
            </div>
            <p className="text-xs text-slate-500">Upload bagan berupa gambar (JPG/PNG).</p>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="flex justify-end sticky bottom-6 z-10">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 py-4 px-10 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-brand-500/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan Profil...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Simpan Perubahan Profil
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
