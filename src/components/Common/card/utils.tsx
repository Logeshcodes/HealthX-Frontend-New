
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
   
    console.error(error.message)
    throw new Error(`Error: ${error.message}`)
  } else if (typeof error === 'string') {
 
    console.error(error)
    throw new Error(`Error: ${error}`)
  } else {
   
    console.error(error)
    throw new Error(`Unknown error: ${JSON.stringify(error)}`)
  }
}

// DEBOUNCE
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}