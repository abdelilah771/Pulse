import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractTitle(content: string): string {
  if (!content) return "";
  return content.split('\n')[0].substring(0, 30);
}
