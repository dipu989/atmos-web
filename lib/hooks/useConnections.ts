'use client'

import { useQuery } from '@tanstack/react-query'
import { getGmailStatus } from '@/lib/api/client'

const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export function useGmailStatus() {
  return useQuery({
    queryKey: ['gmailStatus'],
    queryFn: () => getGmailStatus(),
    staleTime: STALE_TIME,
  })
}
