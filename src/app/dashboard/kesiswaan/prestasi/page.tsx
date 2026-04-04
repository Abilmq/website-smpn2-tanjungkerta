import { fetchAllPrestasi } from '@/app/actions/prestasi.actions'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Edit, Trophy } from 'lucide-react'
import DeletePrestasiButton from './DeletePrestasiButton'

const TINGKAT_COLORS: Record<string, string> = {
  'Sekolah': 'bg-slate-100 text-slate-700',
  'Kecamatan': 'bg-green-100 text-green-700',
  'Kabupaten': 'bg-blue-100 text-blue-700',
  'Provinsi': 'bg-purple-100 text-purple-700',
  'Nasional': 'bg-amber-100 text-amber-700',
  'Internasional': 'bg-rose-100 text-rose-700',
}

export default async function PrestasiListPage() {
  const prestasiList = await fetchAllPrestasi()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Prestasi Siswa & Sekolah</h2>
          <p className="text-slate-500 mt-1">{prestasiList?.length ?? 0} penghargaan tercatat</p>
        </div>
        <Link
          href="/dashboard/kesiswaan/prestasi/baru"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          Tambah Prestasi Baru
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {prestasiList && prestasiList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Prestasi & Siswa</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Kategori / Tahun</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Tingkat</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prestasiList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          {item.foto_url ? (
                            <Image src={item.foto_url} alt={item.nama_prestasi} fill className="object-cover" />
                          ) : (
                            <Trophy className="w-6 h-6 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 line-clamp-1 max-w-sm">{item.nama_prestasi}</p>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1">{item.nama_siswa}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <p className="text-sm text-slate-700">{item.kategori}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Tahun {item.tahun}</p>
                    </td>
                    <td className="py-4 px-6 text-center hidden lg:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${TINGKAT_COLORS[item.tingkat] || TINGKAT_COLORS['Sekolah']}`}>
                        {item.tingkat}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/kesiswaan/prestasi/${item.id}/edit`}
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeletePrestasiButton id={item.id} nama_prestasi={item.nama_prestasi} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
               <Trophy className="w-8 h-8 text-amber-500" />
             </div>
             <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada data prestasi</h3>
             <p className="text-slate-500 mb-6">Mulai catat pencapaian dan penghargaan yang diraih siswa/sekolah.</p>
             <Link
               href="/dashboard/kesiswaan/prestasi/baru"
               className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
             >
               Tambah Data Prestasi
             </Link>
          </div>
        )}
      </div>
    </div>
  )
}
