'use client'

import { useState, useRef, useEffect, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft, RefreshCw, XCircle } from 'lucide-react'
import { verifyOtp, resendOtp } from '@/app/actions/auth.actions'

function VerifyOTPForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const errorMsg = searchParams.get('message')
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(60)
  const [isPending, startTransition] = useTransition()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      router.replace('/login')
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, email, router])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
    if (newOtp.every(char => char !== '') && value !== '') {
      submitOtpAction(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const submitOtpAction = (code: string) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('token', code)
      await verifyOtp(formData)
    })
  }

  const handleResend = () => {
    setCountdown(60)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      await resendOtp(formData)
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Verifikasi 2 Langkah</h2>
        <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
          Kami telah mengirimkan 6 digit kode OTP ke email <br/>
          <span className="font-semibold text-slate-800">{email}</span>
        </p>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2 border border-red-100 text-center justify-center">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form action={() => submitOtpAction(otp.join(''))}>
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white transition-all outline-none"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending || otp.some(digit => digit === '')}
            className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mb-6"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Verifikasi & Masuk'
            )}
          </button>
        </form>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-slate-500">
              Belum menerima kode? Tunggu <span className="font-semibold text-brand-600">{countdown}s</span>
            </p>
          ) : (
            <button 
              type="button"
              onClick={handleResend}
              disabled={isPending}
              className="text-sm text-brand-600 font-semibold hover:text-brand-700 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} /> Kirim ulang kode
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
        <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke halaman login
        </Link>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-slate-400">
            Memuat halaman verifikasi...
          </div>
        }>
          <VerifyOTPForm />
        </Suspense>
      </div>
    </div>
  )
}
