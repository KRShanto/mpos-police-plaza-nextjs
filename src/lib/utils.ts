import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function generateEmployeeId(): string {
  // Generate a random 10-digit number
  const min = 1000000000; // 10-digit number starts from 1000000000
  const max = 9999999999; // 10-digit number ends at 9999999999
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
