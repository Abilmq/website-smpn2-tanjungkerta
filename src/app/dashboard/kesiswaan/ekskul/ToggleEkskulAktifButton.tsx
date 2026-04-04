'use client'

import { useTransition } from 'react'
import { Check, X } from 'lucide-react'
import { toggleEkskulAktif } from '@/app/actions/ekskul.actions'

export default function ToggleEkskulAktifButton({ id, aktif }: { id: string, aktif: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(async () => {
        await toggleEkskulAktif(id, aktif)
      })}
      disabled={isPending}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
        aktif ? 'bg-emerald-500' : 'bg-slate-300'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      role="switch"
      aria-checked={aktif}
    >
      <span className="sr-only">Toggle status aktif</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform flex items-center justify-center ${
          aktif ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        {isPending ? (
          <span className="w-2 h-2 rounded-full border border-t-transparent border-slate-400 animate-spin" />
        ) : aktif ? (
          <Check className="w-2.5 h-2.5 text-emerald-600" />
        ) : (
          <X className="w-2.5 h-2.5 text-slate-400" />
        )}
      </span>
    </button>
  )
}
