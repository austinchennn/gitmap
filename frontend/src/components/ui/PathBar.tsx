'use client'

import { motion } from 'framer-motion'
import { useGitMapStore } from '@/store/useGitMapStore'

export default function PathBar() {
  const { hoveredNode, repoData } = useGitMapStore()

  if (!hoveredNode || !repoData) return null

  const pathParts = hoveredNode.node.path
    ? [repoData.repo, ...hoveredNode.node.path.split('/')]
    : [repoData.repo]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
    >
      <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md shadow-apple-lg border border-black/5 text-xs font-medium text-apple-gray-600 max-w-[600px] overflow-hidden">
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center gap-1 min-w-0">
            {i > 0 && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-apple-gray-300 flex-shrink-0">
                <path d="M2 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            )}
            <span className={`truncate ${i === pathParts.length - 1 ? 'text-apple-gray-900' : ''}`}>
              {part}
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  )
}
