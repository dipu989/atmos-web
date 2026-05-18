'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Dashboard
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => api.dashboard.getSummary(),
  });
}

// Trips
export function useTrips(dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['trips', { dateFrom, dateTo }],
    queryFn: () => api.trips.getTrips(dateFrom, dateTo),
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: () => api.trips.getTrip(id),
    enabled: !!id,
  });
}

// Analytics
export function useAnalyticsTrends(
  mode?: string,
  period?: 'month' | 'year',
) {
  return useQuery({
    queryKey: ['analytics', 'trends', { mode, period }],
    queryFn: () => api.analytics.getTrends(mode, period),
  });
}

// Insights
export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () => api.insights.getInsights(),
  });
}

// User
export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => api.user.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.user.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}
