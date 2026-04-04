export default function WaveDivider({ 
  position = 'bottom', 
  colorClass = 'text-white dark:text-slate-950' 
}: { 
  position?: 'top' | 'bottom', 
  colorClass?: string 
}) {
  const transform = position === 'top' ? 'rotate-180' : '';
  const placementClass = position === 'top' ? 'top-0 -mt-[1px]' : 'bottom-0 -mb-[1px]';
  
  return (
    <div className={`absolute left-0 w-full overflow-hidden leading-[0] z-10 scale-105 ${placementClass} ${transform}`}>
      {/* 
        Mewarnai SVG seringkali gagal di Tailwind v4 dengan property fill-*, 
        jadi praktik paling aman adalah menjadikan SVG mewarisi warna teks (currentColor) 
        dan memberikan SVG class warna teks (text-*).
      */}
      <svg 
        className={`relative block w-full h-[60px] md:h-[120px] ${colorClass}`} 
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,150.71,101.92,227.42,81.38Z"></path>
      </svg>
    </div>
  );
}
