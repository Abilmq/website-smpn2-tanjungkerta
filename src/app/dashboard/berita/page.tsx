import { fetchAllBerita } from '@/app/actions/berita.actions'
import Link from 'next/link'
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import DeleteBeritaButton from './DeleteBeritaButton'
import TogglePublishButton from './TogglePublishButton'

const KATEGORI_COLORS: Record<string, string> = {
  'Prestasi': 'bg-yellow-100 text-yellow-800',
  'Akademik': 'bg-blue-100 text-blue-800',
  'Kegiatan': 'bg-green-100 text-green-800',
  'Pengumuman': 'bg-purple-100 text-purple-800',
  'Umum': 'bg-slate-100 text-slate-700',
}

export default async function BeritaListPage() {
  const beritaList = await fetchAllBerita()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Manajemen Berita</h2>
          <p className="text-slate-500 mt-1">{beritaList?.length ?? 0} total artikel</p>
        </div>
        <Link
          href="/dashboard/berita/baru"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          Tulis Berita Baru
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {beritaList && beritaList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Judul</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Kategori</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Tanggal</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {beritaList.map((berita) => (
                  <tr key={berita.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-900 line-clamp-1 max-w-xs">{berita.judul}</p>
                      <p className="text-xs text-slate-400 mt-0.5">/{berita.slug}</p>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${KATEGORI_COLORS[berita.kategori] ?? KATEGORI_COLORS['Umum']}`}>
                        {berita.kategori}
                      </span>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell">
                      <span className="text-sm text-slate-500">
                        {new Date(berita.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <TogglePublishButton id={berita.id} published={berita.published} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/berita/${berita.id}/edit`}
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteBeritaButton id={berita.id} judul={berita.judul} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <PlusCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada berita</h3>
            <p className="text-slate-500 mb-6">Mulai tulis artikel pertama untuk website sekolah.</p>
            <Link
              href="/dashboard/berita/baru"
              className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
            >
              Tulis Berita Sekarang
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
