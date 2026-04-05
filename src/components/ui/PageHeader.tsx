import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs: BreadcrumbItem[];
  hidePatternBackground?: boolean;
}

export default function PageHeader({ title, description, crumbs, hidePatternBackground = false }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-brand-900 overflow-hidden text-center z-0">
      {/* Elemen Dekoratif Premium Geometris */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent-500 opacity-20 [clip-path:polygon(100%_0,0_0,100%_100%)]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-600 opacity-20 [clip-path:polygon(0_100%,0_0,100%_100%)]"></div>
        {!hidePatternBackground && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        )}
      </div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Breadcrumb Navbar Tipis */}
        <nav className="flex justify-center items-center gap-2 text-sm text-brand-300 mb-6 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          {crumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-brand-500" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-white border-b-2 border-accent-500 pb-0.5">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        
        {/* Konten Utama Header */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-sm">{title}</h1>
        {description && (
          <p className="text-lg md:text-xl text-brand-100 font-medium max-w-3xl mx-auto leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  )
}
