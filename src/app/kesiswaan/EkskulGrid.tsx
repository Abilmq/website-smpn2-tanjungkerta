'use client'

import { useState } from 'react'
import { Star, Users, Calendar, X } from 'lucide-react'

type Ekskul = {
  id: string
  nama: string
  deskripsi: string | null
  pembina: string | null
  jadwal: string | null
  foto_url: string | null
}

export default function EkskulGrid({ data }: { data: Ekskul[] }) {
  const [selectedEkskul, setSelectedEkskul] = useState<Ekskul | null>(null)

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-200">
        <Star className="w-10 h-10 text-slate-300 mb-4" />
        <p className="text-slate-500">Data ekstrakurikuler segera hadir.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((ekskul) => (
          <div
            key={ekskul.id}
            onClick={() => setSelectedEkskul(ekskul)}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-brand-500 transition-all hover:-translate-y-1"
          >
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              {ekskul.foto_url ? (
                <img
                  src={ekskul.foto_url}
                  alt={ekskul.nama}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-50">
                  <Star className="w-12 h-12 text-brand-200" />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                {ekskul.nama}
              </h3>
              {ekskul.deskripsi && (
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                  {ekskul.deskripsi}
                </p>
              )}
              <div className="space-y-2 text-sm">
                {ekskul.pembina && (
                  <p className="flex items-center gap-2 text-slate-600">
                    <Users className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="font-medium">Pembina:</span> {ekskul.pembina}
                  </p>
                )}
                {ekskul.jadwal && (
                  <p className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-accent-500 shrink-0" />
                    <span className="font-medium">Jadwal:</span> {ekskul.jadwal}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL POP-UP */}
      {selectedEkskul && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedEkskul(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="aspect-video sm:aspect-[21/9] bg-slate-100 relative overflow-hidden">
              {selectedEkskul.foto_url ? (
                <img
                  src={selectedEkskul.foto_url}
                  alt={selectedEkskul.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-50">
                  <Star className="w-16 h-16 text-brand-200" />
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-6">
                Ekstrakurikuler {selectedEkskul.nama}
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-brand-100 text-brand-600 rounded-lg shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pembina</p>
                    <p className="font-medium text-slate-900">{selectedEkskul.pembina || '-'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-accent-100 text-accent-600 rounded-lg shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jadwal Rutin</p>
                    <p className="font-medium text-slate-900">{selectedEkskul.jadwal || '-'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Deskripsi Kegiatan</h4>
                {selectedEkskul.deskripsi ? (
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedEkskul.deskripsi}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">Belum ada deskripsi untuk ekstrakurikuler ini.</p>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedEkskul(null)}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
