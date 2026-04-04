import { fetchAllGaleri } from '@/app/actions/galeri.actions'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Edit, Image as ImageIcon } from 'lucide-react'
import DeleteGaleriButton from './DeleteGaleriButton'

export default async function GaleriListPage() {
  const galeriList = await fetchAllGaleri()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Galeri Sekolah</h2>
          <p className="text-slate-500 mt-1">{galeriList?.length ?? 0} media tersimpan</p>
        </div>
        <Link
          href="/dashboard/galeri/baru"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          Upload Media Baru
        </Link>
      </div>

      {/* Grid */}
      {galeriList && galeriList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galeriList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                {item.media_url ? (
                  <Image
                    src={item.media_url}
                    alt={item.judul}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  </div>
                )}
                
                {/* Overlay Action */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/dashboard/galeri/${item.id}/edit`}
                    className="p-2.5 bg-white text-brand-600 hover:text-white hover:bg-brand-600 rounded-full transition-colors shadow-lg"
                    title="Edit Detail"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
                
                <DeleteGaleriButton id={item.id} judul={item.judul} />
                
                <div className="absolute bottom-2 left-2">
                   <span className="px-2 py-1 bg-black/60 backdrop-blur text-white text-[10px] font-medium rounded">
                     {item.kategori}
                   </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 line-clamp-1">{item.judul}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[32px]">
                  {item.deskripsi || 'Tidak ada deskripsi'}
                </p>
                {item.tanggal_kegiatan && (
                  <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5 before:w-1.5 before:h-1.5 before:bg-brand-200 before:rounded-full">
                    {new Date(item.tanggal_kegiatan).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Galeri masih kosong</h3>
          <p className="text-slate-500 mb-6 max-w-sm">Upload foto-foto kegiatan atau fasilitas sekolah untuk ditampilkan di halaman galeri publik.</p>
          <Link
            href="/dashboard/galeri/baru"
            className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            Mulai Upload Foto
          </Link>
        </div>
      )}
    </div>
  )
}
