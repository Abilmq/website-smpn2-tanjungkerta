'use client'

import { useState, useTransition, useRef } from 'react'
import { kirimKomentar } from '@/app/actions/berita.actions'
import { MessageSquare, User, Send, Loader2 } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function KomentarSection({ beritaId, komentarList, urlPath }: { beritaId: string, komentarList: any[], urlPath: string }) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // State & Ref untuk Google reCAPTCHA
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccess(false)
    setError('')
    
    // Validasi reCAPTCHA
    if (!captchaValue) {
      setError('Mohon verifikasi bahwa Anda bukan robot dengan mencentang reCAPTCHA.')
      return
    }
    
    const formData = new FormData(e.currentTarget)
    formData.append('berita_id', beritaId)
    formData.append('url_path', urlPath)
    
    const form = e.currentTarget

    startTransition(async () => {
      const result = await kirimKomentar(formData)
      if (result.error) {
        setError(result.error)
        recaptchaRef.current?.reset()
        setCaptchaValue(null)
      } else {
        setSuccess(true)
        form.reset()
        recaptchaRef.current?.reset()
        setCaptchaValue(null)
      }
    })
  }

  return (
    <div className="mt-16 pt-12 border-t border-slate-200" id="komentar">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-brand-100 p-3 rounded-xl text-brand-600">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Komentar Pembaca <span className="text-slate-400 font-medium text-lg ml-2">({komentarList.length})</span></h3>
      </div>
      
      {/* List Komentar */}
      <div className="space-y-6 mb-12">
        {komentarList.length === 0 ? (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
            <p className="text-slate-500">Belum ada komentar. Jadilah yang pertama memberikan tanggapan!</p>
          </div>
        ) : (
          komentarList.map((k) => (
            <div key={k.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-slate-900">{k.nama_pengirim}</h4>
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(k.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{k.isi_komentar}</p>
                
                {/* Balasan Admin */}
                {k.admin_reply && (
                  <div className="mt-4 bg-brand-50 border border-brand-100 rounded-xl p-4 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-brand-600" />
                      <span className="font-bold text-brand-700 text-sm">Balasan Admin SMPN 2</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{k.admin_reply}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Tambah Komentar */}
      <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200">
        <h4 className="font-bold text-slate-900 text-lg mb-6">Tinggalkan Komentar</h4>
        
        {success && (
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-xl mb-6 font-medium animate-in fade-in">
            Komentar Anda berhasil dikirimkan!
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl mb-6 font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              name="nama_pengirim"
              required
              placeholder="Masukkan nama Anda..."
              className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-xl px-4 py-3 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Komentar</label>
            <textarea 
              name="isi_komentar"
              required
              rows={4}
              placeholder="Tuliskan tanggapan Anda mengenai artikel ini..."
              className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-xl px-4 py-3 outline-none transition-all resize-none"
            ></textarea>
          </div>
          
          {/* Widget Google reCAPTCHA v2 Asli */}
          <div className="flex justify-start">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={(val) => setCaptchaValue(val)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 justify-center text-white font-bold py-3 px-6 rounded-xl transition-colors w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Kirim Komentar</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
