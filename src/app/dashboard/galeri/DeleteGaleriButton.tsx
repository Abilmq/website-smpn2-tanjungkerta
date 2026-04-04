'use client'

import { useState, useTransition } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import { deleteGaleri } from '@/app/actions/galeri.actions'

export default function DeleteGaleriButton({ id, judul }: { id: string, judul: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteGaleri(id)
      setIsOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors absolute top-2 right-2 bg-white/80 backdrop-blur"
        title="Hapus Media"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hapus Media?</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Apakah Anda yakin ingin menghapus foto <span className="font-semibold text-slate-700">"{judul}"</span>?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="py-2.5 px-4 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-200 bg-slate-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="py-2.5 px-4 rounded-xl text-sm font-medium text-white hover:bg-red-700 bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
