import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitRegistration(reg: string | null) {
  if (!reg) return null

  let x = reg.split('/')
  if (x.length != 3) return null

  let regNo ={
    year: parseInt(x[0]),
    dprt: x[1],
    roll: parseInt(x[2]),
  }
  if (regNo.year > 0 && regNo.year <  5 || regNo.dprt.length > 1 && regNo.dprt.length < 3 || regNo.roll > 0 && regNo.roll < 70) return regNo
  
  return null
}
