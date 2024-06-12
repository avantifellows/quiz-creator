import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createQueryString(params: { [key: string]: string | number }) {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
}

export function toTitleCase(text: string) {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
