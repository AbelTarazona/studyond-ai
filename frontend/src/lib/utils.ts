import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculates weeks remaining from a deadline string (YYYY-MM-DD)
export function weeksUntil(deadline: string): number {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 7)))
}

// Returns urgency level based on weeks left
export function getUrgency(weeksLeft: number): 'calm' | 'moderate' | 'urgent' {
  if (weeksLeft <= 4) return 'urgent'
  if (weeksLeft <= 10) return 'moderate'
  return 'calm'
}

// Calculates field overlap score between two arrays of field IDs
export function fieldOverlapScore(studentFields: string[], entityFields: string[]): number {
  if (!studentFields.length || !entityFields.length) return 0
  const overlap = studentFields.filter(f => entityFields.includes(f)).length
  const total = new Set([...studentFields, ...entityFields]).size
  return Math.round((overlap / total) * 100)
}
