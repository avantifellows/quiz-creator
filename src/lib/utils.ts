import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createQueryString(params: { [key: string]: string | number }) {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
}
