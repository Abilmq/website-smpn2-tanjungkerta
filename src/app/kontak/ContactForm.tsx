'use client'

import { useState, useTransition } from 'react'
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { kirimPesan } from '@/app/actions/kontak.actions'

export default function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await kirimPesan(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        // Reset form
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 font-heading">Kirim Pesan</h3>
        <p className="text-slate-500 text-sm mt-1">Kami akan membalas pesan Anda ke alamat email yang Anda berikan.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-brand-600" />
          <div>
            <p className="font-bold text-brand-800">Pesan Berhasil Terkirim!</p>
            <p className="text-brand-600 mt-1">Terima kasih telah menghubungi kami. Kami akan segera merespon pesan Anda.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="nama_pengirim" className="text-sm font-semibold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              id="nama_pengirim" 
              name="nama_pengirim" 
              required
              placeholder="Masukkan nama Anda..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl outline-none transition-all text-slate-900"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email_pengirim" className="text-sm font-semibold text-slate-700">Alamat Email <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              id="email_pengirim" 
              name="email_pengirim" 
              required
              placeholder="nama@email.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl outline-none transition-all text-slate-900"
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="subjek" className="text-sm font-semibold text-slate-700">Subjek Pesan <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="subjek" 
            name="subjek" 
            required
            placeholder="Hal apa yang ingin Anda tanyakan?"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl outline-none transition-all text-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pesan" className="text-sm font-semibold text-slate-700">Isi Pesan <span className="text-red-500">*</span></label>
          <textarea 
            id="pesan" 
            name="pesan" 
            rows={5}
            required
            placeholder="Tuliskan pesan Anda selengkapnya di sini..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl outline-none transition-all resize-none text-slate-900"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-4 mt-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/30 hover:shadow-xl hover:-translate-y-0.5"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Mengirim Pesan...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" /> Kirim Pesan Sekarang
            </>
          )}
        </button>
      </form>
    </div>
  )
}
