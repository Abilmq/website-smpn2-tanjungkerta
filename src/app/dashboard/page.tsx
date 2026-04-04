import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, BookOpen, Image as ImageIcon, Bell, ArrowUpRight, PlusCircle, Upload, FileText } from 'lucide-react'

async function getDashboardStats() {
  const supabase = await createClient()

  const [berita, pengumuman, guru, galeri, pesan] = await Promise.all([
    supabase.from('berita').select('id', { count: 'exact', head: true }),
    supabase.from('pengumuman').select('id', { count: 'exact', head: true }),
    supabase.from('guru').select('id', { count: 'exact', head: true }),
    supabase.from('galeri').select('id', { count: 'exact', head: true }),
    supabase.from('pesan_kontak').select('id', { count: 'exact', head: true }).eq('dibaca', false),
  ])

  return {
    totalBerita: berita.count ?? 0,
    totalPengumuman: pengumuman.count ?? 0,
    totalGuru: guru.count ?? 0,
    totalGaleri: galeri.count ?? 0,
    pesanBelumDibaca: pesan.count ?? 0,
  }
}

async function getRecentBerita() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('berita')
    .select('id, judul, created_at, status')
    .order('created_at', { ascending: false })
    .limit(5)

  return data ?? []
}

async function getRecentPesan() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('pesan_kontak')
    .select('id, nama, subjek, created_at, dibaca')
    .order('created_at', { ascending: false })
    .limit(4)

  return data ?? []
}

export default async function DashboardOverviewPage() {
  const [stats, recentBerita, recentPesan] = await Promise.all([
    getDashboardStats(),
    getRecentBerita(),
    getRecentPesan(),
  ])

  const statCards = [
    {
      name: 'Total Berita',
      value: stats.totalBerita,
      icon: BookOpen,
      color: 'bg-blue-500',
      href: '/dashboard/berita',
    },
    {
      name: 'Total Pengumuman',
      value: stats.totalPengumuman,
      icon: Bell,
      color: 'bg-emerald-500',
      href: '/dashboard/pengumuman',
    },
    {
      name: 'Total Guru & Tendik',
      value: stats.totalGuru,
      icon: Users,
      color: 'bg-amber-500',
      href: '/dashboard/guru',
    },
    {
      name: 'Total Galeri',
      value: stats.totalGaleri,
      icon: ImageIcon,
      color: 'bg-purple-500',
      href: '/dashboard/galeri',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Selamat datang kembali! 👋</h2>
          <p className="text-slate-500 mt-1">Berikut ringkasan terkini website SMPN 2 Tanjungkerta.</p>
        </div>
        {stats.pesanBelumDibaca > 0 && (
          <Link
            href="/dashboard/pesan"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {stats.pesanBelumDibaca} pesan belum dibaca
          </Link>
        )}
      </div>

      {/* Stats Grid - Data Nyata dari Database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">{stat.name}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Berita Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">Berita Terbaru</h3>
            <Link href="/dashboard/berita" className="text-xs font-medium text-brand-600 hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentBerita.length > 0 ? recentBerita.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.judul}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                  item.status === 'published'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.status === 'published' ? 'Tayang' : 'Draft'}
                </span>
              </div>
            )) : (
              <div className="px-6 py-12 text-center">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Belum ada berita. <Link href="/dashboard/berita/baru" className="text-brand-600 font-medium hover:underline">Tulis sekarang →</Link></p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Kanan */}
        <div className="space-y-6">
          {/* Aksi Cepat */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">Aksi Cepat</h3>
            </div>
            <div className="p-3 space-y-1">
              <Link href="/dashboard/berita/baru" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Tulis Berita Baru</p>
                  <p className="text-xs text-slate-500">Buat artikel/kegiatan terbaru</p>
                </div>
              </Link>
              <Link href="/dashboard/pengumuman/baru" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Buat Pengumuman</p>
                  <p className="text-xs text-slate-500">Informasi penting untuk publik</p>
                </div>
              </Link>
              <Link href="/dashboard/galeri/baru" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Upload Galeri</p>
                  <p className="text-xs text-slate-500">Tambah foto dokumentasi</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Pesan Masuk Terbaru */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900">Pesan Masuk</h3>
              <Link href="/dashboard/pesan" className="text-xs font-medium text-brand-600 hover:underline">
                Lihat semua →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentPesan.length > 0 ? recentPesan.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/pesan/${item.id}`}
                  className={`flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors ${!item.dibaca ? 'bg-brand-50/40' : ''}`}
                >
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!item.dibaca ? 'bg-brand-500' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm line-clamp-1 ${!item.dibaca ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {item.nama}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.subjek}</p>
                  </div>
                </Link>
              )) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-slate-400">Belum ada pesan masuk</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
