'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// ==========================================
// KONFIGURASI KEAMANAN
// ==========================================
const MAX_LOGIN_ATTEMPTS = 5        // Maksimal percobaan gagal
const LOCK_DURATION_MINUTES = 15    // Durasi lock dalam menit

// ==========================================
// HELPER: Login Attempt Rate Limiting
// ==========================================

/**
 * Cek apakah email sedang terkunci karena terlalu banyak gagal login.
 * Return: { locked: boolean, message: string, remainingAttempts: number }
 */
async function checkLoginAttempts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string
) {
  const { data } = await supabase
    .from('login_attempts')
    .select('attempt_count, locked_until')
    .eq('email', email.toLowerCase())
    .single()

  // Belum pernah ada percobaan = aman
  if (!data) {
    return { locked: false, message: '', remainingAttempts: MAX_LOGIN_ATTEMPTS }
  }

  // Cek apakah masih terkunci
  if (data.locked_until) {
    const lockUntil = new Date(data.locked_until)
    const now = new Date()

    if (lockUntil > now) {
      const diffMs = lockUntil.getTime() - now.getTime()
      const diffMins = Math.ceil(diffMs / 60000)
      return {
        locked: true,
        message: `Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${diffMins} menit.`,
        remainingAttempts: 0,
      }
    }
  }

  // Tidak terkunci, hitung sisa percobaan
  const remaining = MAX_LOGIN_ATTEMPTS - (data.attempt_count || 0)
  return { locked: false, message: '', remainingAttempts: remaining }
}

/**
 * Catat percobaan login yang gagal.
 * Jika sudah >= MAX_LOGIN_ATTEMPTS, set locked_until.
 * Return: pesan error yang informatif
 */
async function recordFailedAttempt(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string
): Promise<string> {
  const normalizedEmail = email.toLowerCase()

  // Ambil data attempts saat ini
  const { data: existing } = await supabase
    .from('login_attempts')
    .select('id, attempt_count, locked_until')
    .eq('email', normalizedEmail)
    .single()

  if (!existing) {
    // Baru pertama kali gagal — insert record baru
    await supabase.from('login_attempts').insert({
      email: normalizedEmail,
      attempt_count: 1,
      last_attempt_at: new Date().toISOString(),
    })
    const remaining = MAX_LOGIN_ATTEMPTS - 1
    return `Kredensial salah. Sisa percobaan: ${remaining}x`
  }

  // Update attempt count
  const newCount = (existing.attempt_count || 0) + 1

  // Cek apakah harus di-lock
  if (newCount >= MAX_LOGIN_ATTEMPTS) {
    const lockUntil = new Date()
    lockUntil.setMinutes(lockUntil.getMinutes() + LOCK_DURATION_MINUTES)

    await supabase
      .from('login_attempts')
      .update({
        attempt_count: newCount,
        locked_until: lockUntil.toISOString(),
        last_attempt_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    return `Terlalu banyak percobaan gagal. Akun terkunci selama ${LOCK_DURATION_MINUTES} menit.`
  }

  // Belum sampai limit — update counter saja
  await supabase
    .from('login_attempts')
    .update({
      attempt_count: newCount,
      last_attempt_at: new Date().toISOString(),
    })
    .eq('id', existing.id)

  const remaining = MAX_LOGIN_ATTEMPTS - newCount
  return `Kredensial salah. Sisa percobaan: ${remaining}x`
}

/**
 * Reset counter gagal login setelah login sukses.
 */
async function resetLoginAttempts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string
) {
  const normalizedEmail = email.toLowerCase()
  await supabase
    .from('login_attempts')
    .update({
      attempt_count: 0,
      locked_until: null,
      last_attempt_at: new Date().toISOString(),
    })
    .eq('email', normalizedEmail)
}

// ==========================================
// AUTH ACTIONS
// ==========================================

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  // STEP 0: Cek apakah email terkunci (Rate Limiting)
  const lockStatus = await checkLoginAttempts(supabase, email)
  if (lockStatus.locked) {
    return redirect(`/login?message=${encodeURIComponent(lockStatus.message)}`)
  }

  // Langkah 1: Verifikasi email & password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    // Catat percobaan gagal + dapatkan pesan informatif
    const errorMessage = await recordFailedAttempt(supabase, email)
    return redirect(`/login?message=${encodeURIComponent(errorMessage)}`)
  }

  // Login sukses → Reset counter gagal
  await resetLoginAttempts(supabase, email)

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
