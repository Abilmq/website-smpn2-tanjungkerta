import React from 'react';

export default function RunningText({ 
  items, 
  bgClass = 'bg-accent-500', 
  textClass = 'text-white' 
}: { 
  items: string[], 
  bgClass?: string, 
  textClass?: string 
}) {
  return (
    <div className={`relative overflow-hidden w-full ${bgClass} py-4 shadow-xl z-20`}>
      {/* 
        Menempelkan animasi murni via <style> 
        untuk memastikan Tailwind atau bundler tidak menghilangkan keyframes-nya 
      */}
      <style>{`
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        .marquee-wrapper {
          display: flex;
          width: max-content;
          animation: scroll-marquee 40s linear infinite;
        }
        .marquee-wrapper:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className={`marquee-wrapper ${textClass} font-bold tracking-widest uppercase md:text-sm text-xs`}>
        {/* Render 2 blok duplikat; karena translateX(-50%), looping akan mulus */}
        {[...Array(2)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex pl-8 gap-8 items-center shrink-0">
            {items.map((item, index) => (
               <span key={`${groupIndex}-${index}`} className="flex items-center gap-4 whitespace-nowrap">
                 <span>{item}</span>
                 {/* Ikon pemisah tulisan */}
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-70 mx-2" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                 </svg>
               </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
