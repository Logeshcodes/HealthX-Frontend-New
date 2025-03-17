import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
}

interface CardTitleProps {
  children: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={` rounded-2xl shadow-lg overflow-hidden bg-slate-800 ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => (
  <div className="p-4 border-b bg-slate-800">{children}</div>
);

export const CardTitle: React.FC<CardTitleProps> = ({ children }) => (
  <h2 className="text-lg font-bold bg-slate-800">{children}</h2>
);

export const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <div className="p-4 bg-slate-800">{children}</div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={`p-4 border-t ${className}`}>{children}</div>
);
