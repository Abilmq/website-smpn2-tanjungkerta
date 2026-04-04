'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  // Langkah 1: Verifikasi email & password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    return redirect('/login?message=Kredensial salah. Email atau sandi tidak cocok')
  }

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
