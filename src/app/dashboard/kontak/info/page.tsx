'use client'

import { useState, useTransition, useEffect } from 'react'
import { Save, Loader2, AlertCircle, CheckCircle2, MapPin, Phone, Mail, Clock, Map, Facebook, Instagram, Youtube } from 'lucide-react'
import { fetchInfoKontak, saveInfoKontak } from '@/app/actions/kontak.actions'

export default function InfoKontakPage() {
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  const [alamat, setAlamat] = useState('')
  const [email, setEmail] = useState('')
  const [telepon, setTelepon] = useState('')
  const [jamOperasional, setJamOperasional] = useState('')
  const [embedMaps, setEmbedMaps] = useState('')
  
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInfoKontak()
        if (data) {
          setAlamat(data.alamat || '')
          setEmail(data.email || '')
          setTelepon(data.telepon || '')
          setJamOperasional(data.jam_operasional || '')
          setEmbedMaps(data.embed_maps || '')
          setFacebookUrl(data.facebook_url || '')
          setInstagramUrl(data.instagram_url || '')
          setYoutubeUrl(data.youtube_url || '')
        }
      } catch (err) {
        setError('Gagal memuat data kontak')
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
    formData.set('alamat', alamat)
    formData.set('email', email)
    formData.set('telepon', telepon)
    formData.set('jam_operasional', jamOperasional)
    formData.set('embed_maps', embedMaps)
    formData.set('facebook_url', facebookUrl)
    formData.set('instagram_url', instagramUrl)
    formData.set('youtube_url', youtubeUrl)

    startTransition(async () => {
      const result = await saveInfoKontak(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccessMsg('Info kontak berhasil disimpan')
        setTimeout(() => setSuccessMsg(null), 3000)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-4" />
        <p className="text-slate-500">Memuat data kontak...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Pengaturan Info Kontak</h2>
          <p className="text-slate-500 mt-1">Kelola informasi alamat, surel, kontak telepon dan maps.</p>
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
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                Alamat Lengkap
              </label>
              <textarea
                rows={3}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Misal: Jl. Raya Tanjungkerta..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none resize-none"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-600" />
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@sekolah.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-600" />
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="(0261) 123456"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                Jam Operasional
              </label>
              <input
                type="text"
                value={jamOperasional}
                onChange={(e) => setJamOperasional(e.target.value)}
                placeholder="Misal: Senin - Jumat: 07:00 - 15:00"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2 border-t pt-6 mt-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Map className="w-4 h-4 text-brand-600" />
                URL Embed Google Maps
              </label>
              <p className="text-xs text-slate-500 mb-2">Ambil dari Google Maps -&gt; Share -&gt; Embed a map -&gt; Copy src url dalam tag iframe (hanya ambil link di dalam src=&quot;...&quot;).</p>
              <input
                type="text"
                value={embedMaps}
                onChange={(e) => setEmbedMaps(e.target.value)}
                placeholder="https://maps.google.com/maps?..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              />
            </div>

          </div>
        </div>

        {/* Tautan Sosial Media */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Tautan Sosial Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Facebook className="w-4 h-4 text-brand-600" />
                Facebook URL
              </label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-brand-600" />
                Instagram URL
              </label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-brand-600" />
                YouTube URL
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-10">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 py-4 px-10 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-brand-500/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan Data...
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
