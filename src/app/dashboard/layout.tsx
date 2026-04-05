'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Image as ImageIcon, 
  Users, 
  UserSquare2, 
  Trophy, 
  BookOpen, 
  School, 
  LogOut,
  Menu,
  X,
  MessageSquare,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/actions/auth.actions'
import { createClient } from '@/lib/supabase/client'
import SessionTimeoutProvider from '@/components/SessionTimeoutProvider'

const sidebarMenus = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Berita', href: '/dashboard/berita', icon: FileText },
  { name: 'Pengumuman', href: '/dashboard/pengumuman', icon: Bell },
  { name: 'Galeri', href: '/dashboard/galeri', icon: ImageIcon },
  { 
    name: 'Kesiswaan', 
    icon: Users,
    submenus: [
      { name: 'Ekstrakurikuler', href: '/dashboard/kesiswaan/ekskul' },
      { name: 'Prestasi', href: '/dashboard/kesiswaan/prestasi', icon: Trophy },
    ]
  },
  { name: 'Guru & Tendik', href: '/dashboard/guru', icon: UserSquare2 },
  { name: 'Akademik', href: '/dashboard/akademik', icon: BookOpen },
  { name: 'Profil Sekolah', href: '/dashboard/profil', icon: School },
  { 
    name: 'Kontak', 
    icon: MessageSquare,
    submenus: [
      { name: 'Info Kontak', href: '/dashboard/kontak/info' },
      { name: 'Pesan Masuk', href: '/dashboard/pesan' },
    ]
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Kesiswaan')
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('Administrator')
  const [userInitial, setUserInitial] = useState<string>('AD')

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const email = user.email || ''
        const displayName = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0] || 'Administrator'
        setUserEmail(email)
        setUserName(displayName)
        setUserInitial(displayName.substring(0, 2).toUpperCase())
      }
    }
    fetchUser()
  }, [])

  const toggleSubmenu = (menuName: string) => {
    if (expandedMenu === menuName) {
      setExpandedMenu(null)
    } else {
      setExpandedMenu(menuName)
    }
  }

  return (
    <SessionTimeoutProvider>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="p-6 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Logo SMPN 2 Tanjungkerta" 
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-bold text-white tracking-wide">Panel Admin</span>
            </Link>
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Utama</p>
            <nav className="space-y-1">
              {sidebarMenus.map((menu) => {
                if (menu.submenus) {
                  return (
                    <div key={menu.name}>
                      <button
                        onClick={() => toggleSubmenu(menu.name)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          expandedMenu === menu.name
                            ? "bg-slate-800 text-white" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <menu.icon className="w-5 h-5 shrink-0" />
                          {menu.name}
                        </div>
                        <span className="sr-only">Toggle Submenu</span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", expandedMenu === menu.name && "rotate-180")} aria-hidden="true" />
                      </button>
                      
                      {expandedMenu === menu.name && (
                        <div className="mt-1 ml-4 pl-4 border-l border-slate-700 space-y-1">
                          {menu.submenus.map((sub) => {
                            const isActive = pathname === sub.href
                            return (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                  isActive 
                                    ? "bg-brand-600/10 text-brand-400 font-medium" 
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                              >
                                {sub.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }

                const isActive = pathname === menu.href
                return (
                  <Link
                    key={menu.name}
                    href={menu.href as string}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      isActive 
                        ? "bg-brand-600 text-white font-medium shadow-md shadow-brand-900/20" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <menu.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                    {menu.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-accent-500 border border-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {userInitial}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate capitalize">{userName}</p>
                <p className="text-xs text-slate-500 truncate">{userEmail}</p>
              </div>
            </div>
            <button 
              onClick={() => startTransition(() => logout())}
              disabled={isPending}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></span>
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              {isPending ? 'Keluar...' : 'Sign Out'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-slate-200 shadow-sm z-30 px-4 lg:px-6 flex items-center justify-between sticky top-0">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden text-slate-500 hover:text-slate-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="font-heading font-semibold text-slate-900 hidden sm:block">
                {pathname === '/dashboard' ? 'Overview Dashboard' : 
                pathname?.includes('berita') ? 'Manajemen Berita' :
                pathname?.includes('pengumuman') ? 'Papan Pengumuman' :
                pathname?.includes('galeri') ? 'Galeri Sekolah' :
                pathname?.includes('guru') ? 'Data Guru & Tendik' :
                'Sistem Administrasi'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Navigasi ke Publik */}
              <Link 
                href="/" 
                target="_blank"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 hidden sm:block"
              >
                Lihat Website ↗
              </Link>
              
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* Notification Bell */}
              <button className="relative p-2 text-slate-500 hover:text-brand-600 transition-colors rounded-full hover:bg-slate-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionTimeoutProvider>
  )
}

