// Hook that computes supervisor and expert matches based on the student's field IDs
// Match score = field overlap percentage using fieldOverlapScore from utils

import { useMemo } from 'react'
import { supervisors, experts } from '@/data'
import { fieldOverlapScore } from '@/lib/utils'

export interface MatchedSupervisor {
  supervisor: typeof supervisors[number]
  score: number
  overlappingFields: string[]
}

export interface MatchedExpert {
  expert: typeof experts[number]
  score: number
  overlappingFields: string[]
}

export function useMatches(studentFieldIds: string[], topN = 3) {
  const topSupervisors = useMemo<MatchedSupervisor[]>(() => {
    return supervisors
      .map((s) => ({
        supervisor: s,
        score: fieldOverlapScore(studentFieldIds, s.fieldIds),
        overlappingFields: studentFieldIds.filter((f) => s.fieldIds.includes(f)),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
  }, [studentFieldIds, topN])

  const topExperts = useMemo<MatchedExpert[]>(() => {
    return experts
      .map((e) => ({
        expert: e,
        score: fieldOverlapScore(studentFieldIds, e.fieldIds),
        overlappingFields: studentFieldIds.filter((f) => e.fieldIds.includes(f)),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
  }, [studentFieldIds, topN])

  return { topSupervisors, topExperts }
}
