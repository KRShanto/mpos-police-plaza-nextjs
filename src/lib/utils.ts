import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function generateEmployeeId(): string {
  // Generate a random 5-digit number
  const min = 10000; // 5-digit number starts from 10000
  const max = 99999; // 5-digit number ends at 99999
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
