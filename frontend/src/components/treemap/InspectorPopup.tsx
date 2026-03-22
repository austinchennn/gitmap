'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGitMapStore } from '@/store/useGitMapStore'
import { formatSize } from '@/utils/d3-helpers'
import { FileIcon } from '@/components/ui/FileIcon'
import { FileMetadata, DirectoryMetadata } from '@/types'

const OFFSET = 15

export default function InspectorPopup() {
  const { hoveredNode, repoData } = useGitMapStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hoveredNode) return

    const popup = popupRef.current
    if (!popup) return

    const pw = popup.offsetWidth || 280
    const ph = popup.offsetHeight || 160
    const vw = window.innerWidth
    const vh = window.innerHeight

    let x = hoveredNode.x + OFFSET
    let y = hoveredNode.y + OFFSET

    // Edge detection
    if (x + pw > vw - 20) x = hoveredNode.x - pw - OFFSET
    if (y + ph > vh - 20) y = hoveredNode.y - ph - OFFSET

    setPosition({ x, y })
  }, [hoveredNode])

  if (!hoveredNode) return null

  const node = hoveredNode.node
  const isFile = node.type === 'file'
  const meta = node.metadata

  const parentSize = repoData?.tree?.size ?? 0
  const sizePercent = parentSize > 0 ? ((node.size / parentSize) * 100).toFixed(1) : '0'

  return (
    <motion.div
      ref={popupRef}
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed z-50 pointer-events-none"
      style={{ left: position.x, top: position.y }}
    >
      <div className="bg-white/92 backdrop-blur-xl rounded-xl shadow-apple-2xl border border-black/5 p-3 w-64">
        {/* Header */}
        <div className="flex items-start gap-2 mb-3">
          <span className="flex-shrink-0 mt-0.5">
            <FileIcon extension={node.extension} type={node.type} className="w-6 h-6" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-apple-gray-900 text-sm truncate">{node.name}</p>
          </div>
        </div>

        {/* Size Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-apple-gray-500 mb-1">
            <span>{formatSize(node.size)}</span>
            <span>{sizePercent}% of repo</span>
          </div>
          <div className="h-1.5 bg-apple-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, parseFloat(sizePercent))}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full bg-apple-blue rounded-full"
            />
          </div>
        </div>

        {/* Stats */}
        {isFile ? (
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {(meta as FileMetadata)?.category && (
              <div className="bg-apple-gray-50 rounded-lg p-2">
                <p className="text-apple-gray-400 text-[10px] uppercase tracking-wide mb-0.5">Type</p>
                <p className="font-medium text-apple-gray-700 capitalize">
                  {(meta as FileMetadata).category}
                </p>
              </div>
            )}
            {node.extension && (
              <div className="bg-apple-gray-50 rounded-lg p-2">
                <p className="text-apple-gray-400 text-[10px] uppercase tracking-wide mb-0.5">Extension</p>
                <p className="font-medium text-apple-gray-700">{node.extension}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="bg-apple-gray-50 rounded-lg p-2">
              <p className="text-apple-gray-400 text-[10px] uppercase tracking-wide mb-0.5">Files</p>
              <p className="font-medium text-apple-gray-700">
                {(meta as DirectoryMetadata)?.totalFiles ?? 0}
              </p>
            </div>
            <div className="bg-apple-gray-50 rounded-lg p-2">
              <p className="text-apple-gray-400 text-[10px] uppercase tracking-wide mb-0.5">Code Ratio</p>
              <p className="font-medium text-apple-gray-700">
                {(((meta as DirectoryMetadata)?.codeRatio ?? 0) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
