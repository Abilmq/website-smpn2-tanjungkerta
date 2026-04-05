import { fetchSemuaKomentar } from '@/app/actions/berita.actions'
import KomentarList from './KomentarList'
import { MessageSquareQuote } from 'lucide-react'

export default async function KomentarDashboardPage() {
  const komentarList = await fetchSemuaKomentar()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Komentar Berita</h1>
          <p className="text-slate-500">Kelola tanggapan dan berikan balasan langsung kepada pengunjung.</p>
        </div>
        <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
          <MessageSquareQuote className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <KomentarList initialData={komentarList} />
      </div>
    </div>
  )
}
