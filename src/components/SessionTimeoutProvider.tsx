'use client'

import { useEffect, useCallback, useRef, useState, useTransition } from 'react'
import { logout } from '@/app/actions/auth.actions'
import { Clock, ShieldAlert, RefreshCw } from 'lucide-react'

// ==========================================
// KONFIGURASI SESSION TIMEOUT
// ==========================================
const IDLE_TIMEOUT_MS = 15 * 60 * 1000    // 15 menit idle → mulai warning
const WARNING_DURATION_MS = 60 * 1000      // 60 detik warning sebelum logout

// Events yang dianggap sebagai aktivitas user
const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click',
] as const

export default function SessionTimeoutProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [isPending, startTransition] = useTransition()

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isWarningActiveRef = useRef(false)

  /**
   * Logout otomatis setelah timeout habis
   */
  const handleAutoLogout = useCallback(() => {
    startTransition(async () => {
      await logout()
    })
  }, [])

  /**
   * Mulai countdown warning (60 detik sebelum auto logout)
   */
  const startWarningCountdown = useCallback(() => {
    isWarningActiveRef.current = true
    setShowWarning(true)
    setCountdown(WARNING_DURATION_MS / 1000)

    // Countdown setiap detik
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Waktu habis → auto logout
          clearAllTimers()
          handleAutoLogout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Fallback: force logout setelah WARNING_DURATION_MS
    warningTimerRef.current = setTimeout(() => {
      clearAllTimers()
      handleAutoLogout()
    }, WARNING_DURATION_MS)
  }, [handleAutoLogout])

  /**
   * Bersihkan semua timer
   */
  const clearAllTimers = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
      warningTimerRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [])

  /**
   * Reset idle timer — dipanggil setiap ada aktivitas user
   */
  const resetIdleTimer = useCallback(() => {
    // Jangan reset kalau warning sedang aktif (kecuali user klik "Perpanjang")
    if (isWarningActiveRef.current) return

    clearAllTimers()

    // Set timer baru: setelah IDLE_TIMEOUT_MS → tampilkan warning
    idleTimerRef.current = setTimeout(() => {
      startWarningCountdown()
    }, IDLE_TIMEOUT_MS)
  }, [clearAllTimers, startWarningCountdown])

  /**
   * User klik "Perpanjang Sesi" → reset semuanya
   */
  const handleExtendSession = useCallback(() => {
    clearAllTimers()
    isWarningActiveRef.current = false
    setShowWarning(false)
    setCountdown(60)
    resetIdleTimer()
  }, [clearAllTimers, resetIdleTimer])

  /**
   * Setup event listeners untuk deteksi aktivitas user
   */
  useEffect(() => {
    // Mulai idle timer pertama kali
    resetIdleTimer()

    // Tambah event listener untuk setiap event aktivitas
    const handleActivity = () => resetIdleTimer()

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    // Cleanup saat unmount
    return () => {
      clearAllTimers()
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [resetIdleTimer, clearAllTimers])

  return (
    <>
      {children}

      {/* Modal Warning Timeout */}
      {showWarning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white text-center">
              <div className="mx-auto w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold">Sesi Akan Berakhir</h3>
              <p className="text-white/80 text-sm mt-1">
                Anda tidak aktif selama 15 menit
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5 text-center">
              {/* Countdown Circle */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="6"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke={countdown <= 10 ? '#ef4444' : '#f59e0b'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - countdown / 60)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Clock className={`w-4 h-4 mb-0.5 ${countdown <= 10 ? 'text-red-500' : 'text-amber-500'}`} />
                  <span className={`text-2xl font-bold ${countdown <= 10 ? 'text-red-600' : 'text-slate-900'}`}>
                    {countdown}
                  </span>
                  <span className="text-xs text-slate-400">detik</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Anda akan otomatis keluar dari sistem. <br />
                Klik tombol di bawah untuk tetap masuk.
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleExtendSession}
                  className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Perpanjang Sesi
                </button>

                <button
                  onClick={handleAutoLogout}
                  disabled={isPending}
                  className="w-full py-2.5 px-4 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  ) : null}
                  {isPending ? 'Keluar...' : 'Logout Sekarang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
