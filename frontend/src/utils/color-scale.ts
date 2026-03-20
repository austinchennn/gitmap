import { FileNode } from '@/types'

export const FILE_TYPE_COLORS: Record<string, string> = {
  // Code
  '.ts': '#3178C6',
  '.tsx': '#61DAFB',
  '.js': '#F7DF1E',
  '.jsx': '#61DAFB',
  '.py': '#3572A5',
  '.java': '#B07219',
  '.go': '#00ADD8',
  '.rs': '#DEA584',
  '.c': '#555555',
  '.cpp': '#F34B7D',
  '.cs': '#178600',
  '.rb': '#CC342D',
  '.php': '#4F5D95',
  '.swift': '#FA7343',
  '.kt': '#A97BFF',
  '.scala': '#DC322F',
  '.vue': '#41B883',
  '.svelte': '#FF3E00',
  // Web
  '.html': '#E34C26',
  '.css': '#1572B6',
  '.scss': '#CC6699',
  '.sass': '#CC6699',
  // Data
  '.json': '#8BC34A',
  '.yaml': '#CB171E',
  '.yml': '#CB171E',
  '.xml': '#F16529',
  '.toml': '#9C4121',
  // Docs
  '.md': '#083FA1',
  '.mdx': '#083FA1',
  '.txt': '#8E8E93',
  // Shell
  '.sh': '#89E051',
  '.bash': '#89E051',
  // Images
  '.png': '#E91E63',
  '.jpg': '#E91E63',
  '.jpeg': '#E91E63',
  '.svg': '#FF9800',
  '.gif': '#E91E63',
  '.webp': '#E91E63',
  // Default
  default: '#AEAEB2',
}

export const CATEGORY_COLORS = {
  code: '#007AFF',
  doc: '#5856D6',
  resource: '#FF9500',
  other: '#8E8E93',
}

export function getTypeColor(node: FileNode): string {
  if (node.type === 'directory') return '#E8E8ED'
  if (!node.extension) return FILE_TYPE_COLORS.default
  return FILE_TYPE_COLORS[node.extension] ?? FILE_TYPE_COLORS.default
}

export function getCategoryColor(node: FileNode): string {
  if (node.type === 'directory') return '#E8E8ED'
  const meta = node.metadata as { category?: string }
  const cat = meta?.category ?? 'other'
  return CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ?? CATEGORY_COLORS.other
}

export function getHeatmapColor(node: FileNode): string {
  const meta = node.metadata as { latestCommit?: string }
  if (!meta?.latestCommit) return '#E5E5EA'
  
  const now = Date.now()
  const lastCommit = new Date(meta.latestCommit).getTime()
  const ageMs = now - lastCommit
  const ageMonths = ageMs / (1000 * 60 * 60 * 24 * 30)
  
  // Map 0-24 months to blue gradient
  const intensity = Math.max(0, 1 - ageMonths / 24)
  
  // Interpolate between #E5E5EA (old) and #007AFF (recent)
  const r = Math.round(229 + (0 - 229) * intensity)
  const g = Math.round(229 + (122 - 229) * intensity)
  const b = Math.round(234 + (255 - 234) * intensity)
  
  return `rgb(${r},${g},${b})`
}

export function getNodeColor(node: FileNode, mode: string): string {
  switch (mode) {
    case 'heatmap': return getHeatmapColor(node)
    case 'type': return getTypeColor(node)
    default: return getCategoryColor(node)
  }
}
