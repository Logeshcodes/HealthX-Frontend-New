interface CardProps {
    children: React.ReactNode;
    className?: string; // Optional className prop
  }
  
  export const Card = ({ children, className }: CardProps) => {
    return <div className={`card w-800 h-800 ${className || ''}`}>{children}</div>;
  };
  