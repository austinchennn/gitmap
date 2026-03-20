'use client'

import { useState, memo } from 'react'
import { FileNode } from '@/types'
import TreeNode from './TreeNode'

interface FileTreeProps {
  data: FileNode
}

function FileTree({ data }: FileTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([data.path]))

  const toggle = (path: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  return (
    <div className="py-1 px-1">
      {data.children?.map((child) => (
        <TreeNode
          key={child.path}
          node={child}
          depth={0}
          expanded={expanded}
          onToggle={toggle}
        />
      ))}
    </div>
  )
}

export default memo(FileTree)
