'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Footer({ initialData }: { initialData?: any }) {
  const pathname = usePathname()

  // Sembunyikan footer di area admin
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 pt-16 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -ml-10 -mb-20 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Column 1: About */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                  <Image 
                    src="/logo.png" 
                    alt="Logo SMPN 2 Tanjungkerta" 
                    fill
                    sizes="(max-width: 768px) 40px, 48px"
                    className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-lg leading-tight text-white">
                    SMP Negeri 2
                  </span>
                  <span className="text-xs font-medium tracking-wide text-brand-400">
                    TANJUNGKERTA
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 pr-4">
              Mendidik generasi unggul, berakhlak mulia, dan berprestasi di tingkat nasional melalui pembelajaran inovatif dan menyenangkan.
            </p>
            <div className="flex items-center gap-3">
              <a href={initialData?.facebook_url || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={initialData?.instagram_url || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={initialData?.youtube_url || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            <h3 className="font-heading font-semibold text-white text-lg">Tautan Cepat</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/profil" className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors">
                  <span>Profil Sekolah</span>
                </Link>
              </li>
              <li>
                <Link href="/akademik" className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors">
                  <span>Info Akademik</span>
                </Link>
              </li>
              <li>
                <Link href="/kesiswaan" className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors">
                  <span>Ekstrakurikuler</span>
                </Link>
              </li>
              <li>
                <Link href="/informasi/berita" className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors">
                  <span>Berita Terbaru</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-5 lg:col-span-2">
            <h3 className="font-heading font-semibold text-white text-lg">Hubungi Kami</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-brand-500 shrink-0" />
                  <span className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {initialData?.alamat || 'Jl. Raya Tanjungkerta No. 12\nKecamatan Tanjungkerta\nSumedang, Jawa Barat 45354'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-brand-500 shrink-0" />
                  <span className="text-slate-400">
                    {initialData?.jam_operasional || 'Senin - Jumat, 07:00 - 15:00 WIB'}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-5 h-5 text-brand-500 shrink-0" />
                  <span className="text-slate-400">{initialData?.telepon || '(0261) 1234567'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-5 h-5 text-brand-500 shrink-0" />
                  <a href={`mailto:${initialData?.email || 'info@smpn2tanjungkerta.sch.id'}`} className="text-slate-400 hover:text-brand-400 transition-colors">
                    {initialData?.email || 'info@smpn2tanjungkerta.sch.id'}
                  </a>
                </div>
                <Link href="/kontak" className="inline-block mt-2">
                  <span className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors border-b border-brand-500/30 hover:border-brand-400 pb-0.5">
                    Kirim Pesan ke Sekolah
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} SMP Negeri 2 Tanjungkerta. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-white transition-colors">
              Masuk Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
