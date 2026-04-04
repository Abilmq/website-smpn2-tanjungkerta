'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  // -- IMPLEMENTASI LIMITER (MAX 5X GAGAL -> LOCK 15 MENIT) --
  const { data: limitData } = await supabase
    .from('login_attempts')
    .select('*')
    .eq('email', email)
    .single()

  if (limitData) {
    if (limitData.locked_until && new Date(limitData.locked_until) > new Date()) {
      const lockMinutes = Math.ceil((new Date(limitData.locked_until).getTime() - new Date().getTime()) / 60000)
      return redirect(`/login?message=Terlalu banyak percobaan gagal. Akun dikunci sementara. Coba lagi dalam ${lockMinutes} menit.`)
    }
  }

  // Langkah 1: Verifikasi email & password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    // Catat kegagalan login
    let newAttempts = (limitData?.attempts || 0) + 1
    let locked_until = null
    
    if (newAttempts >= 5) {
      // Kunci selama 15 menit
      locked_until = new Date(new Date().getTime() + 15 * 60000).toISOString()
    }

    await supabase
      .from('login_attempts')
      .upsert({
        email,
        attempts: newAttempts,
        locked_until,
        last_attempt: new Date().toISOString()
      }, { onConflict: 'email' })

    if (newAttempts >= 5) {
      return redirect('/login?message=5x Gagal login! Akun dikunci sementara selama 15 menit.')
    }
    
    return redirect(`/login?message=Email atau sandi tidak cocok. Percobaan ${newAttempts}/5`)
  }

  // Jika berhasil login, reset attempts ke 0
  await supabase
    .from('login_attempts')
    .upsert({ email, attempts: 0, locked_until: null, last_attempt: new Date().toISOString() }, { onConflict: 'email' })

  // MODE DEVELOPMENT: Skip OTP jika NEXT_PUBLIC_SKIP_OTP=true di .env.local
  // WAJIB diset false/hapus sebelum production!
  if (process.env.NEXT_PUBLIC_SKIP_OTP === 'true') {
    return redirect('/dashboard')
  }

  // Langkah 2: Sign out dulu, lalu kirim OTP (2FA)
  await supabase.auth.signOut()

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  })

  if (otpError) {
    return redirect(`/login?message=Gagal kirim OTP: ${otpError.message}`)
  }

  return redirect(`/login/verify?email=${encodeURIComponent(email)}`)
}

export async function verifyOtp(formData: FormData) {
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    // Kembali ke halaman verify dengan warning
    return redirect(`/login/verify?email=${encodeURIComponent(email)}&message=Kode OTP salah atau telah kadaluarsa`)
  }

  return redirect('/dashboard')
}

export async function resendOtp(formData: FormData) {
  const email = formData.get('email') as string
  
  const supabase = await createClient()
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  })

  return redirect(`/login/verify?email=${encodeURIComponent(email)}&message=OTP ulang telah dikirim`)
}

export async function logout() {
  const supabase = await createClient()
  
  await supabase.auth.signOut()
  return redirect('/login')
}
