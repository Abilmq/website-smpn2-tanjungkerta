import Image from 'next/image';

export default function MaskedImage({ 
  src, 
  alt, 
  maskType = 'organic', 
  className 
}: { 
  src: string, 
  alt: string, 
  maskType?: 'organic' | 'blob', 
  className?: string 
}) {
  const maskClass = maskType === 'blob' ? 'mask-blob' : 'mask-organic';
  
  return (
    <div className={`relative ${maskClass} bg-brand-200 dark:bg-brand-900/30 w-full h-full min-h-[300px] ${className}`}>
      {(src && (src.startsWith('http') || src.startsWith('/'))) ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        // Placeholder jika gambar belum ada
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-brand-600 dark:text-brand-400 font-medium opacity-60">
          <span className="flex flex-col items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            {alt || 'Gambar Kosong'}
          </span>
        </div>
      )}
    </div>
  );
}
