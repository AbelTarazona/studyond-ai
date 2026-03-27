export const universities = [
  { id: 'uni-01', name: 'ETH Zurich' },
  { id: 'uni-02', name: 'EPFL' },
  { id: 'uni-03', name: 'University of St. Gallen (HSG)' },
  { id: 'uni-04', name: 'University of Zurich' },
  { id: 'uni-05', name: 'University of Bern' },
  { id: 'uni-06', name: 'University of Basel' },
  { id: 'uni-07', name: 'ZHAW' },
  { id: 'uni-08', name: 'FHNW' },
  { id: 'uni-09', name: 'OST - Eastern Switzerland University of Applied Sciences' },
  { id: 'uni-10', name: 'USI - Universita della Svizzera italiana' },
] as const

export function getUniversityName(id: string): string {
  return universities.find((u) => u.id === id)?.name ?? id
}
