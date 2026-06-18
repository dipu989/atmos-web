'use client'

import { useState } from 'react'
import { Key, Copy, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAPIKeys } from '@/lib/hooks/useTrips'
import { useCreateAPIKey, useRevokeAPIKey } from '@/lib/hooks/useMutations'
import { SettingsSection } from '@/components/settings/SettingsSection'
import type { CreateAPIKeyResponse } from '@/types/index'

// ─── Key row ─────────────────────────────────────────────────────────────────

function KeyRow({
  id,
  name,
  prefix,
  lastUsedAt,
  createdAt,
  onRevoke,
  revoking,
}: {
  id: string
  name: string
  prefix: string
  lastUsedAt?: string
  createdAt: string
  onRevoke: (id: string) => void
  revoking: boolean
}) {
  const created = new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const lastUsed = lastUsedAt
    ? new Date(lastUsedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div className="flex items-center justify-between gap-4 border-b border-divider py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-text-primary">{name}</p>
        <p className="mt-0.5 text-[12px] text-text-secondary">
          <span className="font-mono">{prefix}••••••••</span>
          <span className="mx-2">·</span>
          <span>Created {created}</span>
          {lastUsed && (
            <>
              <span className="mx-2">·</span>
              <span>Last used {lastUsed}</span>
            </>
          )}
        </p>
      </div>
      <button
        type="button"
        disabled={revoking}
        onClick={() => onRevoke(id)}
        className={cn(
          'flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors',
          'border-alert-red/30 text-alert-red hover:bg-alert-red/5',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <Trash2 size={12} />
        {revoking ? 'Revoking…' : 'Revoke'}
      </button>
    </div>
  )
}

// ─── Create modal ─────────────────────────────────────────────────────────────

function CreateKeyModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (name: string) => void
}) {
  const [name, setName] = useState('')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-card" style={{ padding: '28px 32px' }}>
        <h3 className="text-[16px] font-semibold text-text-primary">Create API key</h3>
        <p className="mt-1 text-[13px] text-text-secondary">Give your key a descriptive name.</p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My integration"
          maxLength={64}
          className={cn(
            'mt-4 w-full rounded-lg border border-divider bg-bg-page px-3 py-2',
            'text-[14px] text-text-primary placeholder:text-text-secondary',
            'focus:border-horizon-blue focus:outline-none',
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) onCreate(name.trim())
          }}
        />

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-divider px-4 py-2 text-[13px] font-medium text-text-secondary hover:bg-bg-page"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name.trim()}
            onClick={() => onCreate(name.trim())}
            className={cn(
              'rounded-lg bg-horizon-blue px-4 py-2 text-[13px] font-semibold text-white',
              'hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Show new key modal ────────────────────────────────────────────────────────

function NewKeyRevealModal({
  apiKey,
  onClose,
}: {
  apiKey: CreateAPIKeyResponse
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(apiKey.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-card" style={{ padding: '28px 32px' }}>
        <h3 className="text-[16px] font-semibold text-text-primary">API key created</h3>
        <p className="mt-1 text-[13px] text-text-secondary">
          Copy your key now — it won&apos;t be shown again.
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-divider bg-bg-page px-3 py-2">
          <span className="flex-1 truncate font-mono text-[12px] text-text-primary">
            {apiKey.key}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 text-text-secondary hover:text-text-primary"
            aria-label="Copy API key"
          >
            {copied ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-horizon-blue py-2 text-[13px] font-semibold text-white hover:opacity-90"
        >
          Done
        </button>
      </div>
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function KeySkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-divider py-4 last:border-b-0">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3.5 w-32 animate-pulse rounded bg-bg-page" />
        <div className="h-3 w-48 animate-pulse rounded bg-bg-page" />
      </div>
      <div className="h-7 w-16 animate-pulse rounded-lg bg-bg-page" />
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function APIKeysSection() {
  const { data: keys, isLoading, isError } = useAPIKeys()
  const createMutation = useCreateAPIKey()
  const revokeMutation = useRevokeAPIKey()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [revealedKey, setRevealedKey] = useState<CreateAPIKeyResponse | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  async function handleCreate(name: string) {
    setShowCreateModal(false)
    try {
      const result = await createMutation.mutateAsync(name)
      setRevealedKey(result)
    } catch {
      // error is surfaced via mutation.isError if needed
    }
  }

  async function handleRevoke(id: string) {
    setRevokingId(id)
    try {
      await revokeMutation.mutateAsync(id)
    } finally {
      setRevokingId(null)
    }
  }

  const footer = (
    <button
      type="button"
      onClick={() => setShowCreateModal(true)}
      disabled={createMutation.isPending}
      className={cn(
        'flex items-center gap-2 rounded-lg bg-horizon-blue px-4 py-2 text-[13px] font-semibold text-white',
        'hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      <Key size={14} />
      {createMutation.isPending ? 'Creating…' : 'Create new key'}
    </button>
  )

  return (
    <>
      <SettingsSection
        title="API Keys"
        description="Create keys to access the Atmos API from your own applications. Each key is shown once."
        footer={footer}
      >
        {isLoading && (
          <>
            <KeySkeleton />
            <KeySkeleton />
          </>
        )}

        {isError && (
          <p className="py-6 text-center text-[13px] text-alert-red">
            Failed to load API keys. Please refresh and try again.
          </p>
        )}

        {!isLoading && !isError && keys && keys.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <Key size={36} color="#C5CCD6" aria-hidden="true" />
            <p className="mt-3 text-[14px] font-medium text-text-secondary">No API keys yet</p>
            <p className="mt-1 text-[13px] text-text-secondary">
              Create a key to start integrating with Atmos.
            </p>
          </div>
        )}

        {!isLoading && !isError && keys && keys.length > 0 && (
          <div>
            {keys.map((k) => (
              <KeyRow
                key={k.id}
                id={k.id}
                name={k.name}
                prefix={k.prefix}
                lastUsedAt={k.lastUsedAt}
                createdAt={k.createdAt}
                onRevoke={handleRevoke}
                revoking={revokingId === k.id}
              />
            ))}
          </div>
        )}
      </SettingsSection>

      {showCreateModal && (
        <CreateKeyModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}

      {revealedKey && (
        <NewKeyRevealModal
          apiKey={revealedKey}
          onClose={() => setRevealedKey(null)}
        />
      )}
    </>
  )
}
