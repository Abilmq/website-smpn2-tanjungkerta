'use client'

import { useState, useTransition, useEffect } from 'react'
import { Save, Loader2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react'
import { fetchAkademik, saveAkademik } from '@/app/actions/akademik.actions'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/editor/ImageUploader'

const QuillNoSSRWrapper = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center animate-pulse"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>,
})

const quillModules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link'],
    ['clean'],
  ],
}

export default function AkademikPage() {
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  const [kurikulum, setKurikulum] = useState('')
  const [kalenderUrl, setKalenderUrl] = useState('')
  const [jadwalUrl, setJadwalUrl] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAkademik()
        if (data) {
          setKurikulum(data.kurikulum || '')
          setKalenderUrl(data.kalender_akademik_url || '')
          setJadwalUrl(data.jadwal_pelajaran_url || '')
        }
      } catch (err) {
        setError('Gagal memuat data akademik')
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
    formData.set('kurikulum', kurikulum)
    formData.set('kalender_akademik_url', kalenderUrl)
    formData.set('jadwal_pelajaran_url', jadwalUrl)

    startTransition(async () => {
      const result = await saveAkademik(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccessMsg('Informasi Akademik berhasil disimpan')
        setTimeout(() => setSuccessMsg(null), 3000)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-4" />
        <p className="text-slate-500">Memuat data akademik...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Informasi Akademik</h2>
          <p className="text-slate-500 mt-1">Kelola kurikulum, jadwal pelajaran, dan kalender pendidikan</p>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Kurikulum */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              Sistem Kurikulum & Pembelajaran
            </h3>
            <div className="prose-editor">
              <QuillNoSSRWrapper
                theme="snow"
                value={kurikulum}
                onChange={setKurikulum}
                modules={quillModules}
                placeholder="Jelaskan mengenai kurikulum yang digunakan oleh sekolah..."
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Gunakan editor di atas untuk memformat teks (tebal, miring, list, dll).</p>
          </div>

          <hr className="border-slate-100" />

          {/* Media / File Lampiran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 mb-2">Kalender Akademik (Foto/Dokumen)</h3>
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center p-2 relative group">
                <ImageUploader value={kalenderUrl} onChange={setKalenderUrl} />
              </div>
              <p className="text-xs text-slate-500">Upload infografik / bagan Kalender Akademik tahun berjalan (JPG/PNG).</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 mb-2">Jadwal Pelajaran Umum</h3>
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center p-2 relative group">
                 <ImageUploader value={jadwalUrl} onChange={setJadwalUrl} />
              </div>
              <p className="text-xs text-slate-500">Upload waktu/jam masuk, istirahat, dan pulang sekolah (JPG/PNG).</p>
            </div>
          </div>

        </div>

        {/* Action Bottom */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 z-10 backdrop-blur-sm bg-slate-50/90">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 py-3 px-8 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-xl transition-colors shadow-sm shadow-brand-500/20"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Simpan Informasi Akademik
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
