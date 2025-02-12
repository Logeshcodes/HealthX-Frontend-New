import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-primary ${className}`}
      {...props}
    />
  );
}
