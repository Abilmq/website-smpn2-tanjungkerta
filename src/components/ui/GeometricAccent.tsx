export default function GeometricAccent({ 
  type, 
  className,
  style 
}: { 
  type: 'circle' | 'dots' | 'cross', 
  className?: string,
  style?: React.CSSProperties
}) {
  if (type === 'dots') {
    return <div className={`absolute bg-dots opacity-20 pointer-events-none ${className}`} style={style}></div>;
  }
  
  if (type === 'circle') {
    return <div className={`absolute rounded-full mix-blend-multiply opacity-30 animate-float-slow pointer-events-none ${className}`} style={style}></div>;
  }
  
  if (type === 'cross') {
    return (
      <div className={`absolute opacity-20 text-brand-500 font-bold text-3xl pointer-events-none ${className}`} style={style}>
        +
      </div>
    );
  }
  
  return null;
}
