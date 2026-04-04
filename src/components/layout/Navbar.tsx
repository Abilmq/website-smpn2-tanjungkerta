'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, PhoneCall } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const navLinks = [
  { name: 'Beranda', href: '/' },
  {
    name: 'Profil',
    href: '#',
    subItems: [
      { name: 'Sejarah, Visi & Misi', href: '/profil/sejarah' },
      { name: 'Sambutan Kepala Sekolah', href: '/profil/sambutan' },
      { name: 'Guru & Tendik', href: '/profil/guru' },
    ],
  },
  {
    name: 'Akademik',
    href: '/akademik',
  },
  {
    name: 'Kesiswaan',
    href: '/kesiswaan',
  },
  {
    name: 'Informasi',
    href: '#',
    subItems: [
      { name: 'Berita & Prestasi', href: '/informasi/berita' },
      { name: 'Pengumuman / Agenda', href: '/informasi/pengumuman' },
    ],
  },
  { name: 'Galeri', href: '/galeri' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cek apakah admin route
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null
  }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Logo SMPN 2 Tanjungkerta" 
                  fill
                  sizes="(max-width: 768px) 56px, 64px"
                  className="object-contain drop-shadow-sm"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg leading-tight text-slate-900 transition-colors">
                  SMP Negeri 2
                </span>
                <span className="text-xs font-medium tracking-wide text-brand-600 transition-colors">
                  TANJUNGKERTA
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="px-4 py-2 font-medium text-sm transition-colors flex items-center gap-1 text-[#626262] hover:text-brand-600 group-hover:text-brand-600 relative after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-brand-600 after:scale-x-0 after:origin-center group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                  >
                    {link.name}
                    {link.subItems && (
                      <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {link.subItems && (
                    <AnimatePresence>
                      {activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 pt-2 w-48"
                        >
                          <div className="bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden py-1">
                            {link.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-2.5 text-sm text-[#626262] hover:text-brand-600 hover:bg-slate-50 transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Action */}
            <div className="hidden lg:flex items-center">
              <Link
                href="/kontak"
                className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 border border-brand-500 hover:-translate-y-0.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hubungi Kami</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[#626262]"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="relative z-[999]">
            <motion.div
              initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
              animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
                <span className="font-heading font-bold text-lg text-slate-900">Menu Navigasi</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 rounded-full text-slate-600 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 flex-1">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      {link.subItems ? (
                        <div className="mb-1">
                          <div className="px-4 py-3 font-medium text-slate-900 flex items-center justify-between">
                            {link.name}
                          </div>
                          <div className="flex flex-col pl-4 border-l-2 border-slate-100 ml-4">
                            {link.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="px-4 py-2.5 text-[#626262] text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          className="block px-4 py-3 font-medium text-[#626262] rounded-lg hover:bg-slate-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
              
              <div className="p-5 border-t border-slate-100 bg-slate-50 mt-auto shrink-0">
                <Link
                  href="/kontak"
                  className="w-full bg-brand-600 text-white rounded-lg px-4 py-3 font-medium flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PhoneCall className="w-5 h-5" />
                  Hubungi Sekolah
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
