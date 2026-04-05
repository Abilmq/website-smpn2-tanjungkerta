'use client'

import { useState, useTransition } from 'react'
import { balasKomentar, hapusKomentar } from '@/app/actions/berita.actions'
import { Trash2, CornerDownRight, Check, Newspaper } from 'lucide-react'

export default function KomentarList({ initialData }: { initialData: any[] }) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('komentar_id', id)
    
    startTransition(async () => {
      await balasKomentar(formData)
      setReplyingTo(null)
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus komentar ini secara permanen?')) {
      startTransition(async () => {
        await hapusKomentar(id)
      })
    }
  }

  if (initialData.length === 0) {
    return <p className="text-center text-slate-500 py-8">Belum ada komentar yang masuk saat ini.</p>
  }

  return (
    <div className="space-y-6">
      {initialData.map((k) => (
        <div key={k.id} className="border border-slate-100 p-4 rounded-xl shadow-sm hover:border-slate-300 transition-all bg-slate-50/50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-slate-900">{k.nama_pengirim}</h4>
              <p className="text-xs text-slate-400">
                {new Date(k.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setReplyingTo(replyingTo === k.id ? null : k.id)}
                className="text-xs bg-brand-50 text-brand-600 px-3 py-1 rounded-md font-bold hover:bg-brand-100 transition-colors"
                disabled={isPending}
              >
                {replyingTo === k.id ? 'Batal' : (k.admin_reply ? 'Edit Balasan' : 'Balas')}
              </button>
              <button 
                onClick={() => handleDelete(k.id)}
                className="text-white bg-red-500 p-1.5 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                disabled={isPending}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Label Berita Terkait */}
          {k.berita && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white inline-flex px-2 py-0.5 rounded border border-slate-200 mb-3 items-center w-fit max-w-[90%]">
              <Newspaper className="w-3 h-3 shrink-0" />
              <span className="truncate">{k.berita.judul}</span>
            </div>
          )}

          <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-100 text-sm leading-relaxed">{k.isi_komentar}</p>

          {/* Munculkan balasan jika sedang tidak diedit */}
          {k.admin_reply && replyingTo !== k.id && (
            <div className="mt-3 ml-6 bg-brand-50/50 border border-brand-100 p-3 rounded-lg relative flex gap-2">
              <CornerDownRight className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-brand-700 mb-0.5">Balasan Admin</p>
                <p className="text-slate-700">{k.admin_reply}</p>
              </div>
            </div>
          )}

          {/* Mode Form Ketik Balasan */}
          {replyingTo === k.id && (
            <form onSubmit={(e) => handleReplySubmit(e, k.id)} className="mt-3 ml-6 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-start gap-2">
                <CornerDownRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
                <div className="flex-1 space-y-2">
                  <textarea
                    name="admin_reply"
                    required
                    defaultValue={k.admin_reply || ''}
                    placeholder="Tulis balasan Anda sebagai Administrator..."
                    className="w-full text-sm p-3 bg-white border border-brand-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500/20 resize-none h-20"
                  ></textarea>
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className="text-xs bg-brand-600 text-white font-bold px-4 py-2 rounded-md hover:bg-brand-700 flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isPending ? 'Menyimpan...' : 'Simpan Balasan'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

        </div>
      ))}
    </div>
  )
}
