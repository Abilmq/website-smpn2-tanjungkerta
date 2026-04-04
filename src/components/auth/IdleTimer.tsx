'use client'

import { useEffect, useRef } from 'react'
import { logout } from '@/app/actions/auth.actions'

interface IdleTimerProps {
  timeoutMinutes?: number
}

export default function IdleTimer({ timeoutMinutes = 15 }: IdleTimerProps) {
  const timeoutMs = timeoutMinutes * 60 * 1000
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }
    
    // Set a new timeout
    timeoutId.current = setTimeout(async () => {
      // Waktu idle habis, lakukan logout
      console.log('Session expired due to inactivity')
      await logout()
    }, timeoutMs)
  }

  useEffect(() => {
    // Jalankan timer saat pertama kali renger
    resetTimer()

    // Event listener untuk melacak aktivitas user
    const events = [
      'mousemove', 
      'keydown', 
      'wheel', 
      'touchstart', 
      'click'
    ]

    const handleActivity = () => {
      resetTimer()
    }

    events.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    // Bersihkan listener saat komponen di-unmount
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [timeoutMs])

  // Komponen ini murni logic, tidak merender UI apa-apa
  return null
}
