'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clearAuth } from '@/lib/auth'
import { useDeleteAccount } from '@/lib/hooks/useMutations'
import { SettingsSection } from '@/components/settings/SettingsSection'

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('')
  const mutation = useDeleteAccount()
  const confirmed = input === 'delete'

  async function handleDelete() {
    try {
      await mutation.mutateAsync()
    } catch {
      // error displayed inline via mutation.error
      return
    }
    clearAuth()
    window.location.href = '/login'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !mutation.isPending) onClose() }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-7 shadow-card">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-alert-red/10">
          <AlertTriangle size={20} className="text-alert-red" />
        </div>

        <h3 className="text-[16px] font-semibold text-text-primary">Delete account</h3>
        <p className="mt-1 text-[13px] text-text-secondary">
          This schedules your account for deletion. You have 7 days to log back in and recover it.
          After that, all your data is permanently removed.
        </p>

        <p className="mt-4 text-[13px] text-text-secondary">
          Type <span className="font-mono font-semibold text-text-primary">delete</span> to confirm.
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="delete"
          className={cn(
            'mt-2 w-full rounded-lg border border-divider bg-bg-page px-3 py-2',
            'text-[14px] text-text-primary placeholder:text-text-secondary',
            'focus:border-alert-red focus:outline-none',
          )}
        />

        {mutation.error && (
          <p className="mt-2 text-[12px] text-alert-red">
            {mutation.error instanceof Error ? mutation.error.message : 'Something went wrong'}
          </p>
        )}

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="rounded-lg border border-divider px-4 py-2 text-[13px] font-medium text-text-secondary hover:bg-bg-page disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!confirmed || mutation.isPending}
            onClick={handleDelete}
            className={cn(
              'rounded-lg bg-alert-red px-4 py-2 text-[13px] font-semibold text-white',
              'hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {mutation.isPending ? 'Deleting…' : 'Delete my account'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function AccountSection() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <SettingsSection
        title="Account"
        description="Manage your account credentials and deletion."
      >
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-[14px] font-medium text-text-primary">Delete account</p>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={cn(
              'shrink-0 rounded-lg border border-alert-red/30 px-4 py-2',
              'text-[13px] font-medium text-alert-red hover:bg-alert-red/5 transition-colors',
            )}
          >
            Delete account
          </button>
        </div>
      </SettingsSection>

      {showModal && <DeleteAccountModal onClose={() => setShowModal(false)} />}
    </>
  )
}
