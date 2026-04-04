import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Route handler untuk Supabase Auth Callback
// Ini menangani redirect saat Magic Link diklik atau setelah verifikasi email
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Jika ada error (misal OTP expired), redirect ke login dengan pesan
  if (error) {
    const message = errorDescription?.includes('expired')
      ? 'Link login sudah kedaluwarsa. Silakan login ulang dan gunakan kode OTP dari email.'
      : 'Terjadi kesalahan saat verifikasi. Silakan coba lagi.'

    return NextResponse.redirect(
      `${origin}/login?message=${encodeURIComponent(message)}`
    )
  }

  // Jika ada code (dari Magic Link Supabase), tukar dengan session
  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      // Berhasil! Arahkan ke dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Fallback: jika tidak ada code atau ada error lain, kembali ke login
  return NextResponse.redirect(
    `${origin}/login?message=${encodeURIComponent('Verifikasi gagal. Silakan login kembali.')}`
  )
}
