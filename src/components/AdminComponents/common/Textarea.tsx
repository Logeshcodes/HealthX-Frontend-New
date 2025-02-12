import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-primary resize-none ${className}`}
      {...props}
    />
  );
}
