'use client'

import { useState } from 'react'
import { Mail, RefreshCw, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGmailStatus } from '@/lib/hooks/useConnections'
import { useDisconnectGmail, useSyncGmail } from '@/lib/hooks/useMutations'
import { getGmailAuthUrl } from '@/lib/api/client'
import { SettingsSection } from '@/components/settings/SettingsSection'

function GmailSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 animate-pulse rounded-xl bg-bg-page" />
        <div className="space-y-2">
          <div className="h-3.5 w-24 animate-pulse rounded bg-bg-page" />
          <div className="h-3 w-36 animate-pulse rounded bg-bg-page" />
        </div>
      </div>
      <div className="h-8 w-20 animate-pulse rounded-lg bg-bg-page" />
    </div>
  )
}

export function ConnectionsSection() {
  const { data: status, isLoading, isError } = useGmailStatus()
  const disconnectMutation = useDisconnectGmail()
  const syncMutation = useSyncGmail()
  const [connectError, setConnectError] = useState<string | null>(null)

  async function handleConnect() {
    setConnectError(null)
    try {
      const url = await getGmailAuthUrl()
      window.location.href = url
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Failed to connect. Please try again.')
    }
  }

  async function handleSync() {
    try {
      await syncMutation.mutateAsync()
    } catch {
      // error surfaced via syncMutation.isError
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectMutation.mutateAsync()
    } catch {
      // error surfaced via disconnectMutation.isError
    }
  }

  const lastSync = status?.lastSyncAt
    ? new Date(status.lastSyncAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <SettingsSection
      title="Connected apps"
      description="Link third-party services to import your trips automatically."
    >
      {isLoading && <GmailSkeleton />}

      {isError && (
        <p className="py-6 text-center text-[13px] text-alert-red">
          Failed to load connections. Please refresh and try again.
        </p>
      )}

      {!isLoading && !isError && status && (
        <div className="flex items-start justify-between gap-4 py-3">
          {/* Icon + info */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EA4335]/10">
              <Mail size={18} color="#EA4335" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[14px] font-medium text-text-primary">Gmail</p>
                {status.connected && (
                  <CheckCircle2 size={13} className="text-sage" />
                )}
              </div>
              {status.connected && status.email ? (
                <p className="mt-0.5 text-[12px] text-text-secondary">{status.email}</p>
              ) : (
                <p className="mt-0.5 text-[12px] text-text-secondary">
                  Import ride receipts from your inbox
                </p>
              )}
              {status.connected && lastSync && (
                <p className="mt-0.5 text-[11px] text-text-secondary">
                  Last synced {lastSync}
                  {status.lastSyncSummary && status.lastSyncSummary.parsed > 0 && (
                    <> · {status.lastSyncSummary.parsed} trips found</>
                  )}
                </p>
              )}
              {syncMutation.isError && (
                <p className="mt-1 text-[12px] text-alert-red">Sync failed. Try again.</p>
              )}
              {disconnectMutation.isError && (
                <p className="mt-1 text-[12px] text-alert-red">Disconnect failed. Try again.</p>
              )}
              {connectError && (
                <p className="mt-1 text-[12px] text-alert-red">{connectError}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {status.connected ? (
              <>
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncMutation.isPending}
                  title="Sync now"
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border border-divider px-3 py-1.5',
                    'text-[12px] font-medium text-text-secondary hover:bg-bg-page transition-colors',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  <RefreshCw
                    size={12}
                    className={cn(syncMutation.isPending && 'animate-spin')}
                  />
                  {syncMutation.isPending ? 'Syncing…' : 'Sync'}
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={disconnectMutation.isPending}
                  className={cn(
                    'rounded-lg border border-alert-red/30 px-3 py-1.5',
                    'text-[12px] font-medium text-alert-red hover:bg-alert-red/5 transition-colors',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  {disconnectMutation.isPending ? 'Disconnecting…' : 'Disconnect'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                className={cn(
                  'rounded-lg bg-horizon-blue px-4 py-1.5',
                  'text-[12px] font-semibold text-white hover:opacity-90 transition-opacity',
                )}
              >
                Connect
              </button>
            )}
          </div>
        </div>
      )}
    </SettingsSection>
  )
}
