import * as d3 from 'd3'
import { FileNode } from '@/types'

export type D3Node = d3.HierarchyRectangularNode<FileNode>

export function buildD3Hierarchy(data: FileNode): d3.HierarchyNode<FileNode> {
  const root = d3.hierarchy(data, (d) => {
    if (!d.children || d.children.length === 0) return null
    return d.children
  })

  root.sum((d) => {
    if (!d.children || d.children.length === 0) return Math.max(d.size, 1)
    return 0
  })

  root.sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

  return root
}

export function computeTreemap(
  data: FileNode,
  width: number,
  height: number
): d3.HierarchyRectangularNode<FileNode> {
  const root = buildD3Hierarchy(data)

  const treemapLayout = d3
    .treemap<FileNode>()
    .size([width, height])
    .paddingInner(3)
    .paddingTop(20)
    .paddingOuter(4)
    .round(true)

  return treemapLayout(root as d3.HierarchyNode<FileNode> & { value: number })
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
