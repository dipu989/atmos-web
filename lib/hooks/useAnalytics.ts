'use client'

import { useMemo } from 'react'
import { useDailySummaries, useTrips, usePreferences } from './useTrips'
import type { DailySummary, Trip, TransportMode } from '@/types/index'

// ─── Period ───────────────────────────────────────────────────────────────────

export type AnalyticsPeriod = '30d' | '3m' | '6m' | '1y'

export const PERIOD_DAYS: Record<AnalyticsPeriod, number> = {
  '30d': 30,
  '3m': 90,
  '6m': 180,
  '1y': 365,
}

// ─── Chart data shapes ────────────────────────────────────────────────────────

export interface DailyBarPoint {
  date: string
  co2_kg: number
  label: string
}

export interface MomPoint {
  week: string
  current: number
  previous: number
}

export interface ModeWeekPoint {
  week: string
  car: number
  train: number
  bus: number
  bike: number
  walk: number
}

export interface WeekdayPoint {
  day: string
  avg_kg: number
}

export interface AnalyticsTopRoute {
  mode: TransportMode
  from: string
  to: string
  count: number
  total_km: number
  total_kg: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

/** Parse a YYYY-MM-DD (or full ISO datetime) string as a local-time Date to avoid UTC-offset issues. */
function parseLocalDate(dateLocal: string): Date {
  const [y, m, d] = dateLocal.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Format a YYYY-MM-DD string to e.g. "May 22". */
function fmtLabel(dateLocal: string): string {
  const date = parseLocalDate(dateLocal)
  return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}`
}

function sortedSummaries(summaries: DailySummary[]): DailySummary[] {
  return [...summaries].sort((a, b) => a.dateLocal.localeCompare(b.dateLocal))
}

// ─── Transformation functions ─────────────────────────────────────────────────

function toDailyBarData(summaries: DailySummary[]): DailyBarPoint[] {
  return sortedSummaries(summaries).map((d) => ({
    date: d.dateLocal,
    co2_kg: d.totalKgCo2e,
    label: fmtLabel(d.dateLocal),
  }))
}

function toMonthOverMonthData(summaries: DailySummary[]): MomPoint[] {
  const s = sortedSummaries(summaries)
  if (s.length < 2) return []

  const mid = Math.floor(s.length / 2)
  const prev = s.slice(0, mid)
  const curr = s.slice(mid)

  function chunkSums(days: DailySummary[], n: number): number[] {
    const size = Math.max(1, Math.ceil(days.length / n))
    return Array.from({ length: n }, (_, i) =>
      days.slice(i * size, (i + 1) * size).reduce((sum, d) => sum + d.totalKgCo2e, 0),
    )
  }

  const prevSums = chunkSums(prev, 4)
  const currSums = chunkSums(curr, 4)

  return Array.from({ length: 4 }, (_, i) => ({
    week: `W${i + 1}`,
    current: +((currSums[i] ?? 0).toFixed(2)),
    previous: +((prevSums[i] ?? 0).toFixed(2)),
  }))
}

function toModeStackedData(summaries: DailySummary[]): ModeWeekPoint[] {
  const s = sortedSummaries(summaries)
  const weeks: DailySummary[][] = []
  for (let i = 0; i < s.length; i += 7) {
    weeks.push(s.slice(i, i + 7))
  }

  return weeks.map((week, i) => {
    let car = 0, train = 0, bus = 0, bike = 0, walk = 0
    for (const d of week) {
      const bd = d.breakdown
      car   += (bd.car?.kg_co2e ?? 0) + (bd.cab?.kg_co2e ?? 0) + (bd.auto_rickshaw?.kg_co2e ?? 0)
      train += (bd.train?.kg_co2e ?? 0) + (bd.metro?.kg_co2e ?? 0)
      bus   += bd.bus?.kg_co2e ?? 0
      bike  += (bd.cycling?.kg_co2e ?? 0) + (bd.two_wheeler?.kg_co2e ?? 0)
      walk  += bd.walking?.kg_co2e ?? 0
    }
    return {
      week: `Week ${i + 1}`,
      car:   +car.toFixed(2),
      train: +train.toFixed(2),
      bus:   +bus.toFixed(2),
      bike:  +bike.toFixed(2),
      walk:  +walk.toFixed(2),
    }
  })
}

function toWeekdayData(summaries: DailySummary[]): WeekdayPoint[] {
  const acc: Record<string, { sum: number; count: number }> = {}
  for (const day of WEEKDAYS) acc[day] = { sum: 0, count: 0 }

  for (const s of summaries) {
    const dayIndex = (parseLocalDate(s.dateLocal).getDay() + 6) % 7 // 0 = Mon
    const day = WEEKDAYS[dayIndex]
    acc[day].sum += s.totalKgCo2e
    acc[day].count++
  }

  return WEEKDAYS.map((d) => ({
    day: d,
    avg_kg: acc[d].count > 0 ? +((acc[d].sum / acc[d].count).toFixed(2)) : 0,
  }))
}

function toTopRoutes(trips: Trip[]): AnalyticsTopRoute[] {
  const map = new Map<string, AnalyticsTopRoute>()

  for (const t of trips) {
    if (!t.from || !t.to || !t.transportMode) continue
    const key = `${t.from}|${t.to}|${t.transportMode}`
    const r = map.get(key)
    if (r) {
      r.count++
      r.total_km += t.distanceKm ?? 0
      r.total_kg += t.co2Kg ?? 0
    } else {
      map.set(key, {
        mode: t.transportMode,
        from: t.from,
        to: t.to,
        count: 1,
        total_km: t.distanceKm ?? 0,
        total_kg: t.co2Kg ?? 0,
      })
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseAnalyticsResult {
  isLoading: boolean
  isError: boolean
  dailyBarData: DailyBarPoint[]
  momData: MomPoint[]
  modeData: ModeWeekPoint[]
  weekdayData: WeekdayPoint[]
  routesData: AnalyticsTopRoute[]
  goal: number
}

export function useAnalytics(period: AnalyticsPeriod): UseAnalyticsResult {
  const days = PERIOD_DAYS[period]

  const dailyQ = useDailySummaries(days)
  const tripsQ = useTrips({ limit: 500 })
  const prefsQ = usePreferences()

  const summaries = useMemo(() => (Array.isArray(dailyQ.data) ? dailyQ.data : []), [dailyQ.data])
  const trips     = useMemo(() => tripsQ.data?.items ?? [], [tripsQ.data])

  const dailyBarData = useMemo(() => toDailyBarData(summaries), [summaries])
  const momData      = useMemo(() => toMonthOverMonthData(summaries), [summaries])
  const modeData     = useMemo(() => toModeStackedData(summaries), [summaries])
  const weekdayData  = useMemo(() => toWeekdayData(summaries), [summaries])
  const routesData   = useMemo(() => toTopRoutes(trips), [trips])

  const goal = prefsQ.data?.daily_goal_kg_co2e ?? 5

  return {
    isLoading: dailyQ.isLoading || tripsQ.isLoading,
    isError:   dailyQ.isError   || tripsQ.isError,
    dailyBarData,
    momData,
    modeData,
    weekdayData,
    routesData,
    goal,
  }
}
