'use client'

import { motion } from 'framer-motion'
import { useGitMapStore } from '@/store/useGitMapStore'
import { ViewMode } from '@/types'

const MODES: { value: ViewMode; label: string }[] = [
  { value: 'default', label: 'Category' },
  { value: 'type', label: 'Type' },
  { value: 'heatmap', label: 'Activity' },
]

export default function ViewToggle() {
  const { viewMode, setViewMode } = useGitMapStore()

  return (
    <div className="flex items-center gap-0.5 bg-apple-gray-100 rounded-lg p-0.5">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => setViewMode(mode.value)}
          className="relative px-3 py-1 text-xs font-medium rounded-md transition-colors"
        >
          {viewMode === mode.value && (
            <motion.div
              layoutId="viewToggleActive"
              className="absolute inset-0 bg-white rounded-md shadow-apple-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${viewMode === mode.value ? 'text-apple-gray-900' : 'text-apple-gray-500'}`}>
            {mode.label}
          </span>
        </button>
      ))}
    </div>
  )
}
