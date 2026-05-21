'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createTrip,
  deleteTrip,
  markInsightRead,
  updateMe,
  updatePreferences,
  updateTrip,
} from '@/lib/api/client'
import type { CreateTripRequest } from '@/types/index'

export function useCreateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateTripRequest) => createTrip(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['trips'] })
      void queryClient.invalidateQueries({ queryKey: ['dailySummaries'] })
      void queryClient.invalidateQueries({ queryKey: ['weeklySummaries'] })
      void queryClient.invalidateQueries({ queryKey: ['monthlySummaries'] })
      void queryClient.invalidateQueries({ queryKey: ['transportBreakdown'] })
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreateTripRequest> }) =>
      updateTrip(id, body),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['trips'] })
      void queryClient.invalidateQueries({ queryKey: ['trips', variables.id] })
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useMarkInsightRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markInsightRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['insights'] })
    },
  })
}

export function useUpdateMe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Parameters<typeof updateMe>[0]) => updateMe(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Parameters<typeof updatePreferences>[0]) => updatePreferences(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['preferences'] })
    },
  })
}
