'use client'

import { useState, useEffect, useCallback } from 'react'
import { ImageIcon, X, PlaySquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { createPortal } from 'react-dom'

type GaleriItem = {
  id: string
  judul: string
  deskripsi: string | null
  media_type: string
  media_url: string
  kategori: string
  tanggal_kegiatan: string | null
}

export default function GaleriGrid({ data }: { data: GaleriItem[] }) {
  const [selectedItem, setSelectedItem] = useState<GaleriItem | null>(null)
  const [activeKategori, setActiveKategori] = useState<string>('Semua')

  // Ekstrak kategori unik
  const kategoriList = ['Semua', ...Array.from(new Set(data.map(item => item.kategori).filter(Boolean)))]

  // Filter data
  const filteredData = activeKategori === 'Semua' 
    ? data 
    : data.filter(item => item.kategori === activeKategori)

  // Index saat ini untuk navigasi
  const currentIndex = selectedItem ? filteredData.findIndex(item => item.id === selectedItem.id) : -1

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedItem(filteredData[currentIndex - 1])
    }
  }, [currentIndex, filteredData])

  const handleNext = useCallback(() => {
    if (currentIndex < filteredData.length - 1) {
      setSelectedItem(filteredData[currentIndex + 1])
    }
  }, [currentIndex, filteredData])

  // Scroll Lock & Keyboard Lock saat modal terbuka
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') setSelectedItem(null)
    }

    if (selectedItem) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedItem, handlePrev, handleNext])

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
          <ImageIcon className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3">Galeri Masih Kosong</h3>
        <p className="text-slate-500 max-w-md">Album visual kegiatan belajar, rekreasi, dan hari besar sekolah akan segera dipublikasikan di sini.</p>
      </div>
    )
  }

  return (
    <>
      {/* Category Filter */}
      {kategoriList.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {kategoriList.map(kat => (
            <button
              key={kat}
              onClick={() => setActiveKategori(kat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeKategori === kat 
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      )}

      {/* Standard Grid Gallery (Wireframe Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredData.map((item) => (
          <div 
            key={item.id} 
            className="group flex flex-col cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all bg-slate-100 relative overflow-hidden rounded-md"
            onClick={() => setSelectedItem(item)}
          >
            {/* Area Gambar Abu-Abu/Image */}
            <div className="w-full aspect-[1.5/1] relative bg-slate-300 overflow-hidden">
              {item.media_type === 'video' ? (
                <video 
                  src={item.media_url} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  muted
                  playsInline
                />
              ) : (
                <img 
                  src={item.media_url} 
                  alt={item.judul} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              )}
              
              {item.media_type === 'video' && (
                <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-sm text-white z-10">
                  <PlaySquare className="w-4 h-4" />
                </div>
              )}
            </div>
            
            {/* Sabuk Bawah Interaktif (Hover to View) */}
            <div className="absolute inset-x-0 bottom-0 w-full bg-[#24a0bd]/90 backdrop-blur-sm py-3 px-3 flex items-center justify-center text-center translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider line-clamp-1 drop-shadow-sm">
                {item.judul}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
         <div className="py-20 text-center">
            <p className="text-slate-500 font-medium">Tidak ada media untuk kategori {activeKategori}.</p>
         </div>
      )}

      {/* Lightbox Modal */}
      {selectedItem && typeof document !== 'undefined' && createPortal(
        (
          <div className="fixed inset-0 z-[999999] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-200">
          
          {/* Top Bar: Counter & Kembali Button */}
          <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-50">
            <div className="text-white bg-black/40 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md border border-white/10">
              {currentIndex + 1} / {filteredData.length}
            </div>
            
            <button 
              onClick={() => setSelectedItem(null)}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md transition-all border border-white/20 active:scale-95"
            >
              <span className="font-bold text-sm tracking-wide">Kembali</span>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Buttons (Desktop) */}
          <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center p-4 z-40">
            {currentIndex > 0 && (
              <button 
                onClick={handlePrev}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90 border border-white/10 group shadow-lg"
                title="Sebelumnya"
              >
                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
          
          <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center p-4 z-40">
            {currentIndex < filteredData.length - 1 && (
              <button 
                onClick={handleNext}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90 border border-white/10 group shadow-lg"
                title="Selanjutnya"
              >
                <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Main Visual Content */}
          <div className="w-full h-full flex items-center justify-center p-4 md:p-12 lg:p-24 relative select-none">
            {selectedItem.media_type === 'video' ? (
              <video 
                src={selectedItem.media_url} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                controls
                autoPlay
              />
            ) : (
              <img 
                src={selectedItem.media_url} 
                alt={selectedItem.judul} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 pointer-events-none" 
              />
            )}
          </div>

          {/* Title Overlay Footer (Mobile visibility) */}
          <div className="absolute bottom-0 inset-x-0 p-8 flex justify-center pointer-events-none">
             <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 max-w-xl text-center">
                <h4 className="text-white font-bold text-lg">{selectedItem.judul}</h4>
                <p className="text-white/60 text-xs uppercase tracking-widest mt-1 font-bold">{selectedItem.kategori}</p>
             </div>
          </div>
          </div>
        ),
        document.body
      )}
    </>
  )
}
