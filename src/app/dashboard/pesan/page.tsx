import { fetchAllKontak } from '@/app/actions/kontak.actions'
import Link from 'next/link'
import { Mail, CheckCircle, Search, Inbox } from 'lucide-react'
import DeletePesanButton from './DeletePesanButton'

export default async function PesanListPage() {
  const pesanList = await fetchAllKontak()
  
  const belumDibaca = pesanList?.filter(p => !p.dibaca).length || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Kotak Masuk</h2>
          <p className="text-slate-500 mt-1">Pesan dari form Hubungi Kami pengunjung website</p>
        </div>
        <div className="px-5 py-2.5 bg-brand-50 text-brand-700 rounded-xl font-medium border border-brand-100 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          {belumDibaca} Pesan Baru
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Header / Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari pesan..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* List Pesan */}
        <div className="flex-1 overflow-y-auto">
          {pesanList && pesanList.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {pesanList.map((item) => (
                <div 
                  key={item.id} 
                  className={`group flex items-center p-4 hover:bg-slate-50 transition-colors relative ${!item.dibaca ? 'bg-brand-50/30' : ''}`}
                >
                   {/* Unread indicator */}
                   {!item.dibaca && (
                     <div className="w-2.5 h-2.5 rounded-full bg-brand-500 absolute left-4 top-1/2 -translate-y-1/2" />
                   )}
                   
                   <div className="pl-6 md:pl-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                     <div className="md:col-span-3">
                       <h4 className={`text-sm ${!item.dibaca ? 'font-bold text-slate-900' : 'font-medium text-slate-700'} line-clamp-1`}>
                         {item.nama_pengirim}
                       </h4>
                       <p className="text-xs text-slate-500 truncate">{item.email_pengirim}</p>
                     </div>
                     
                     <Link 
                        href={`/dashboard/pesan/${item.id}`}
                        className="md:col-span-7 cursor-pointer hover:underline"
                     >
                       <h4 className={`text-sm ${!item.dibaca ? 'font-bold text-slate-900' : 'font-medium text-slate-700'} line-clamp-1`}>
                         {item.subjek}
                       </h4>
                       <p className={`text-sm ${!item.dibaca ? 'text-slate-600' : 'text-slate-500'} line-clamp-1 mt-0.5`}>
                         - {item.pesan}
                       </p>
                     </Link>
                     
                     <div className="md:col-span-2 flex flex-col md:items-end justify-center gap-1">
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                     </div>
                   </div>

                   <div className="opacity-0 group-hover:opacity-100 transition-opacity pl-4">
                     <DeletePesanButton id={item.id} nama={item.nama_pengirim} />
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                 <Inbox className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-semibold text-slate-900 mb-1">Kotak masuk masih kosong</h3>
               <p className="text-slate-500 text-sm">Belum ada pesan dari pengunjung website.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
