'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createAPIKey,
  deleteAccount,
  disconnectGmail,
  markInsightRead,
  revokeAPIKey,
  syncGmail,
  updateMe,
  updatePreferences,
} from '@/lib/api/client'

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

export function useCreateAPIKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createAPIKey(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
    },
  })
}

export function useRevokeAPIKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => revokeAPIKey(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
    },
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => deleteAccount(),
  })
}

export function useDisconnectGmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => disconnectGmail(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gmailStatus'] })
    },
  })
}

export function useSyncGmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => syncGmail(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gmailStatus'] })
      void queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}
