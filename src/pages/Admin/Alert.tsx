import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ className, children }) => (
  <div className={`p-4 border rounded-lg shadow-sm ${className || ''}`}>
    {children}
  </div>
);

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className,
}) => (
  <div className={`flex items-center ${className || ''}`}>
    <AlertCircle className="mr-2 text-yellow-600" />
    {children}
  </div>
);
