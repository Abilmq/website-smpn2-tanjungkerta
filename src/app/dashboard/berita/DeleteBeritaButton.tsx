'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteBerita } from '@/app/actions/berita.actions'

export default function DeleteBeritaButton({ id, judul }: { id: string; judul: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm(`Hapus berita "${judul}"?\n\nTindakan ini tidak bisa dibatalkan.`)) return
    startTransition(() => deleteBerita(id))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus"
    >
      {isPending ? (
        <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin block" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  )
}
