import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { fetchInfoKontak } from '@/app/actions/kontak.actions'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SMP Negeri 2 Tanjungkerta',
  description: 'Website Resmi SMP Negeri 2 Tanjungkerta, Sumedang, Jawa Barat',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const infoKontak = await fetchInfoKontak()

  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col pt-[76px]`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer initialData={infoKontak} />
      </body>
    </html>
  )
}
