'use client'

import { motion } from 'framer-motion'
import { useGitMapStore } from '@/store/useGitMapStore'

export default function PathBar() {
  const { repoData, drillPath, jumpToDepth } = useGitMapStore()

  if (!repoData || drillPath.length === 0) return null

  const pathParts = drillPath.map((node, index) => ({
    key: `${node.path}-${index}`,
    label: index === 0 ? repoData.repo : node.name,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-0 max-w-[42vw]"
    >
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-black/5 text-xs font-medium text-apple-gray-600 overflow-x-auto">
        {pathParts.map((part, i) => (
          <span key={part.key} className="flex items-center gap-1 min-w-0 flex-shrink-0">
            {i > 0 && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-apple-gray-300 flex-shrink-0">
                <path d="M2 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            )}
            <button
              type="button"
              onClick={() => jumpToDepth(i)}
              className={`truncate transition-opacity hover:opacity-70 ${i === pathParts.length - 1 ? 'text-apple-gray-900' : ''}`}
            >
              {part.label}
            </button>
          </span>
        ))}
      </div>
    </motion.div>
  )
}
