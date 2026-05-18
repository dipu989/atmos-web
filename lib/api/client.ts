const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = new URL(endpoint, API_URL).toString();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signup: (email: string, password: string, displayName: string) =>
      apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName }),
      }),
  },
  dashboard: {
    getSummary: () => apiRequest('/dashboard/summary'),
  },
  trips: {
    getTrips: (dateFrom?: string, dateTo?: string) => {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      return apiRequest(`/trips?${params.toString()}`);
    },
    getTrip: (id: string) => apiRequest(`/trips/${id}`),
  },
  analytics: {
    getTrends: (mode?: string, period?: 'month' | 'year') => {
      const params = new URLSearchParams();
      if (mode) params.append('mode', mode);
      if (period) params.append('period', period);
      return apiRequest(`/analytics/trends?${params.toString()}`);
    },
  },
  insights: {
    getInsights: () => apiRequest('/insights'),
  },
  user: {
    getProfile: () => apiRequest('/user/profile'),
    updateProfile: (data: any) =>
      apiRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
};
