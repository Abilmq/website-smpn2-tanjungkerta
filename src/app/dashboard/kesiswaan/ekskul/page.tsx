import { fetchAllEkskul } from '@/app/actions/ekskul.actions'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Edit, Users } from 'lucide-react'
import DeleteEkskulButton from './DeleteEkskulButton'
import ToggleEkskulAktifButton from './ToggleEkskulAktifButton'

export default async function EkskulListPage() {
  const ekskulList = await fetchAllEkskul()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Ekstrakurikuler</h2>
          <p className="text-slate-500 mt-1">{ekskulList?.length ?? 0} ekstrakurikuler terdaftar</p>
        </div>
        <Link
          href="/dashboard/kesiswaan/ekskul/baru"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          Tambah Ekskul Baru
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {ekskulList && ekskulList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama & Deskripsi</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Pembina</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Jadwal</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ekskulList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          {item.foto_url ? (
                            <Image src={item.foto_url} alt={item.nama} fill className="object-cover" />
                          ) : (
                            <Users className="w-6 h-6 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.nama}</p>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{item.deskripsi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <p className="text-sm text-slate-700">{item.pembina || '-'}</p>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell">
                      <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                        {item.jadwal || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <ToggleEkskulAktifButton id={item.id} aktif={item.aktif} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/kesiswaan/ekskul/${item.id}/edit`}
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteEkskulButton id={item.id} nama={item.nama} />
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
               <Users className="w-8 h-8 text-brand-400" />
             </div>
             <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada ekstrakurikuler</h3>
             <p className="text-slate-500 mb-6">Tambah daftar ekstrakurikuler yang ada di sekolah.</p>
             <Link
               href="/dashboard/kesiswaan/ekskul/baru"
               className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
             >
               Tambah Ekskul
             </Link>
          </div>
        )}
      </div>
    </div>
  )
}
