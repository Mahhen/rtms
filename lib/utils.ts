import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// check whether navigation bar should be made visible or not
export function shouldNavVis(currentPath: string): boolean {
  const restricted = ["/login", "/register"];
  return !restricted.includes(currentPath);
}
