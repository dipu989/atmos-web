// Transport modes
export enum TransportMode {
  DRIVING = 'DRIVING',
  PUBLIC_TRANSIT = 'PUBLIC_TRANSIT',
  CYCLING = 'CYCLING',
  WALKING = 'WALKING',
  CAB = 'CAB',
  METRO = 'METRO',
  TRAIN = 'TRAIN',
  BUS = 'BUS',
  AUTO_RICKSHAW = 'AUTO_RICKSHAW',
  TWO_WHEELER = 'TWO_WHEELER',
  FLIGHT = 'FLIGHT',
}

// Trip
export interface Trip {
  id: string;
  mode: TransportMode;
  origin: string;
  destination: string;
  distanceKm: number;
  durationMin: number;
  kgCO2: number;
  timestamp: string;
  isAutoDetected: boolean;
}

// Dashboard
export interface DashboardSummary {
  todayKgCO2: number;
  dailyGoalKgCO2: number;
  weeklyTrend: Array<{
    day: string;
    kgCO2: number;
  }>;
  transportBreakdown: Array<{
    mode: TransportMode;
    distanceKm: number;
    kgCO2: number;
    percentage: number;
  }>;
  recentTrips: Trip[];
  insights: Insight[];
}

// Insight
export enum InsightType {
  STREAK = 'STREAK',
  MILESTONE = 'MILESTONE',
  TIP = 'TIP',
  COMPARISON = 'COMPARISON',
  ANOMALY = 'ANOMALY',
}

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  body: string;
  streakCount?: number;
  goalProgressPct?: number;
  savingsPct?: number;
  comparisonPct?: number;
  createdAt: string;
  isRead: boolean;
}

// User
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  dailyGoalKgCO2: number;
  createdAt: string;
}

// Analytics
export interface TrendData {
  date: string;
  kgCO2: number;
  modeBreakdown: Record<TransportMode, number>;
}
