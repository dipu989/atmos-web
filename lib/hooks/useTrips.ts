'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getDailySummaries,
  getInsights,
  getMe,
  getMonthlySummaries,
  getPreferences,
  getTransportBreakdown,
  getTrips,
  listAPIKeys,
} from '@/lib/api/client'

const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export function useTrips(params?: Parameters<typeof getTrips>[0]) {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: () => getTrips(params),
    staleTime: STALE_TIME,
  })
}

export function useDailySummaries(days?: number) {
  return useQuery({
    queryKey: ['dailySummaries', { days }],
    queryFn: () => getDailySummaries(days !== undefined ? { days } : undefined),
    staleTime: STALE_TIME,
  })
}

export function useMonthlySummaries(months?: number) {
  return useQuery({
    queryKey: ['monthlySummaries', { months }],
    queryFn: () => getMonthlySummaries(months !== undefined ? { months } : undefined),
    staleTime: STALE_TIME,
  })
}

export function useTransportBreakdown(period?: string) {
  return useQuery({
    queryKey: ['transportBreakdown', { period }],
    queryFn: () => getTransportBreakdown(period !== undefined ? { period } : undefined),
    staleTime: STALE_TIME,
  })
}

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () => getInsights(),
    staleTime: STALE_TIME,
  })
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(),
    staleTime: STALE_TIME,
  })
}

export function usePreferences() {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: () => getPreferences(),
    staleTime: STALE_TIME,
  })
}


export function useAPIKeys() {
  return useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => listAPIKeys(),
    staleTime: STALE_TIME,
  })
}

