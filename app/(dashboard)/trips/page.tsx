'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useTrips } from '@/lib/hooks/useTrips'
import { TripsTable } from '@/components/trips/TripsTable'

const PAGE_SIZE = 20

export default function TripsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useTrips({
    limit:  PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const trips = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <div className="p-6">
      <h1 className="mb-6 text-heading font-semibold text-text-primary">Trips</h1>

      {isError ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-bg-card py-12 shadow-card">
          <AlertCircle size={40} className="text-alert-red" />
          <p className="text-[14px] font-medium text-text-primary">Could not load trips</p>
          <p className="text-[12.5px] text-text-secondary">Please try again later.</p>
        </div>
      ) : (
        <TripsTable
          trips={trips}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          loading={isLoading}
        />
      )}
    </div>
  )
}
