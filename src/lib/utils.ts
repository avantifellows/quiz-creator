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

export const deleteByPath = (object: object, path: string) => {
  let currentObject = object;
  const parts = path.split('.');
  const last = parts.pop();
  for (const part of parts) {
    currentObject = currentObject[part as keyof object];
    if (!currentObject) {
      return;
    }
  }
  delete currentObject[last as keyof object];
};
