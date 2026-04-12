'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, ArrowRight, XCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { login } from '@/app/actions/auth.actions'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get('message')

  const onSubmit = () => {
    setLoading(true)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="p-8">
        {errorMsg && (
          <div className={cn(
            "mb-6 p-4 rounded-xl text-sm flex items-start gap-3 border transition-all animate-in fade-in slide-in-from-top-2",
            errorMsg.includes('terkunci') || errorMsg.includes('Terlalu banyak')
              ? "bg-amber-50 text-amber-700 border-amber-100" 
              : "bg-red-50 text-red-600 border-red-100"
          )}>
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Keamanan Sistem</p>
              <p className="opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        <form action={login} onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block" htmlFor="email">Email Admin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-colors outline-none"
                placeholder="nama@smpn2tanjungkerta.sch.id"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-colors outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Masuk ke Sistem <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
      <div className="bg-slate-50 px-8 py-5 text-center border-t border-slate-100 space-y-2">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          Sistem dilindungi 2FA via Gmail & Rate Limiting.
        </p>
        <p className="text-[10px] text-slate-400 leading-tight">
          Penyalahgunaan akses akan dicatat oleh sistem. <br />
          Maksimal 5x percobaan gagal sebelum akun terkunci otomatis.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Logo SMPN 2 Tanjungkerta" 
                fill
                sizes="48px"
                className="object-contain drop-shadow-sm"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Sistem Admin</h1>
          <p className="text-slate-500 mt-2 text-sm">Masuk untuk mengelola website SMPN 2 Tanjungkerta</p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-slate-400">
            Memuat formulir...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
