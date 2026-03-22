'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileNode } from '@/types'
import { formatSize } from '@/utils/d3-helpers'
import { FileIcon } from '@/components/ui/FileIcon'
import { useGitMapStore } from '@/store/useGitMapStore'

interface TreeNodeProps {
  node: FileNode
  depth: number
  expanded: Set<string>
  onToggle: (path: string) => void
}

function TreeNode({ node, depth, expanded, onToggle }: TreeNodeProps) {
  const { drillDown } = useGitMapStore()
  const isExpanded = expanded.has(node.path)
  const isDir = node.type === 'directory'

  const handleClick = () => {
    if (isDir) {
      onToggle(node.path)
      drillDown(node)
    }
  }

  return (
    <div>
      <motion.div
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer group"
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {/* Expand chevron */}
        <span className="w-3 flex-shrink-0">
          {isDir && (
            <motion.svg
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="text-apple-gray-400"
            >
              <path d="M2 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </motion.svg>
          )}
        </span>

        {/* Icon */}
        <span className="flex-shrink-0 flex items-center justify-center">
          <FileIcon extension={node.extension} type={node.type} className="w-4 h-4" />
        </span>

        {/* Name */}
        <span className="text-xs text-apple-gray-700 truncate flex-1 min-w-0">
          {node.name}
        </span>

        {/* Size badge */}
        <span className="text-[10px] text-apple-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {formatSize(node.size)}
        </span>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {isDir && isExpanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(TreeNode)
