import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`  rounded-2xl bg-white shadow-2xl   transition-transform transform duration-300 
     ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={`mt-4 text-gray-700 text-lg leading-relaxed ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardContentProps) {
  return (
    <div className={`flex flex-col space-y-4 p-6 border-b border-gray-300 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardContentProps) {
  return (
    <h2 className={`text-2xl font-bold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

export function CardFooter({ children, className }: CardContentProps) {
  return (
    <div className={`text-md text-gray-600 border-t border-gray-300 p-4 ${className}`}>
      {children}
    </div>
  );
}
