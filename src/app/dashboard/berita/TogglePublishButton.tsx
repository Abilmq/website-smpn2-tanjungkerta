'use client'

import { useTransition } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { togglePublishBerita } from '@/app/actions/berita.actions'

export default function TogglePublishButton({ id, published }: { id: string; published: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => togglePublishBerita(id, published))}
      disabled={isPending}
      title={published ? 'Klik untuk jadikan Draft' : 'Klik untuk Publish'}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
        published
          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      } disabled:opacity-50`}
    >
      {isPending ? (
        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : published ? (
        <Eye className="w-3 h-3" />
      ) : (
        <EyeOff className="w-3 h-3" />
      )}
      {published ? 'Published' : 'Draft'}
    </button>
  )
}
