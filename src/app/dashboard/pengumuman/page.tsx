import { fetchAllPengumuman } from '@/app/actions/pengumuman.actions'
import Link from 'next/link'
import { PlusCircle, Edit, Megaphone } from 'lucide-react'
import DeletePengumumanButton from './DeletePengumumanButton'
import ToggleAktifButton from './ToggleAktifButton'

export default async function PengumumanListPage() {
  const pengumumanList = await fetchAllPengumuman()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Papan Pengumuman</h2>
          <p className="text-slate-500 mt-1">{pengumumanList?.length ?? 0} total pengumuman</p>
        </div>
        <Link
          href="/dashboard/pengumuman/baru"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          Buat Pengumuman Baru
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {pengumumanList && pengumumanList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Judul & Konten</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Masa Berlaku</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Disematkan</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stts Tampil</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pengumumanList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900 line-clamp-1">{item.judul}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-sm">{item.konten}</p>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <span className="text-sm font-medium text-slate-900">
                        {new Date(item.tanggal_berlaku).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      {new Date(item.tanggal_berlaku) < new Date() && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-lg">KEDALUWARSA</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item.featured ? (
                         <span className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded mx-auto">
                           Ya
                         </span>
                      ) : (
                         <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded mx-auto">
                           Tidak
                         </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <ToggleAktifButton id={item.id} aktif={item.aktif} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/pengumuman/${item.id}/edit`}
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeletePengumumanButton id={item.id} judul={item.judul} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
              <Megaphone className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada pengumuman</h3>
            <p className="text-slate-500 mb-6">Buat papan pengumuman untuk siswa, guru, dan orang tua.</p>
            <Link
              href="/dashboard/pengumuman/baru"
              className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
            >
              Buat Pengumuman Baru
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
