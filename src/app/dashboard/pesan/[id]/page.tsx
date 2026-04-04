import { fetchKontakById } from '@/app/actions/kontak.actions'
import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, User, AtSign, AlignLeft } from 'lucide-react'
import DeletePesanButton from '../DeletePesanButton'

export default async function ReadPesanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchKontakById(id)

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-bold text-slate-800">Pesan tidak ditemukan</h2>
        <Link href="/dashboard/pesan" className="mt-4 text-brand-600 hover:underline">Kembali ke Kotak Masuk</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tombol Back & Delete */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/pesan"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors font-medium text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kotak Masuk
        </Link>
        <div className="px-3 md:px-5 py-2.5 bg-red-50 text-red-700 rounded-xl font-medium border border-red-100 flex items-center gap-2">
           <DeletePesanButton id={data.id} nama={data.nama_pengirim} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Subjek Pesan */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 relative">
          <h2 className="text-2xl font-bold text-slate-900 font-heading mb-4 pr-12">{data.subjek}</h2>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
               <User className="w-4 h-4 text-slate-400" />
               <span className="font-semibold text-slate-800">{data.nama_pengirim}</span>
            </div>
            <div className="flex items-center gap-2">
               <AtSign className="w-4 h-4 text-slate-400" />
               <a href={`mailto:${data.email_pengirim}`} className="text-brand-600 hover:underline">{data.email_pengirim}</a>
            </div>
            <div className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-slate-400" />
               <span>
                 {new Date(data.created_at).toLocaleString('id-ID', { 
                   weekday: 'long', 
                   year: 'numeric', 
                   month: 'long', 
                   day: 'numeric',
                   hour: '2-digit',
                   minute: '2-digit'
                  })}
               </span>
            </div>
          </div>
        </div>

        {/* Isi Pesan */}
        <div className="p-6 md:p-8 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6">
             <AlignLeft className="w-5 h-5 text-brand-600" />
             <h3 className="font-semibold text-slate-900">Isi Pesan:</h3>
          </div>
          
          <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap font-sans text-base leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
             {data.pesan}
          </div>
        </div>
        
        {/* Reply Action */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
           <a 
             href={`mailto:${data.email_pengirim}?subject=Re: ${data.subjek}`}
             className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-brand-500/20"
           >
             <Mail className="w-5 h-5" />
             Balas via Email
           </a>
        </div>
      </div>
    </div>
  )
}
