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
  '.ipynb': '#F39C12',
  '.r': '#276DC3',
  '.m': '#F39F37',
  '.dart': '#0175C2',
  '.ex': '#6E4A7E',
  '.exs': '#6E4A7E',
  '.pl': '#0298C3',
  '.ps1': '#5391FE',
  '.bat': '#4D4D4D',
  '.zsh': '#89E051',
  '.fish': '#4AAE47',
  '.ini': '#7E57C2',
  '.conf': '#7E57C2',
  '.cfg': '#7E57C2',
  '.lock': '#546E7A',
  // Web
  '.html': '#E34C26',
  '.css': '#1572B6',
  '.scss': '#CC6699',
  '.sass': '#CC6699',
  '.less': '#1D365D',
  '.astro': '#FF5D01',
  // Data
  '.json': '#8BC34A',
  '.yaml': '#CB171E',
  '.yml': '#CB171E',
  '.xml': '#F16529',
  '.toml': '#9C4121',
  '.csv': '#43A047',
  '.tsv': '#43A047',
  '.sql': '#336791',
  '.db': '#616161',
  '.sqlite': '#003B57',
  '.graphql': '#E10098',
  '.gql': '#E10098',
  // Docs
  '.md': '#083FA1',
  '.mdx': '#083FA1',
  '.txt': '#8E8E93',
  '.rst': '#5C6BC0',
  '.pdf': '#D32F2F',
  // Shell
  '.sh': '#89E051',
  '.bash': '#89E051',
  '.env': '#2E7D32',
  // Images
  '.png': '#E91E63',
  '.jpg': '#E91E63',
  '.jpeg': '#E91E63',
  '.svg': '#FF9800',
  '.gif': '#E91E63',
  '.webp': '#E91E63',
  // Media / Archives
  '.mp3': '#AB47BC',
  '.wav': '#AB47BC',
  '.mp4': '#FB8C00',
  '.mov': '#FB8C00',
  '.zip': '#6D4C41',
  '.tar': '#6D4C41',
  '.gz': '#6D4C41',
  // Default
  default: '#AEAEB2',
}

const DIRECTORY_COLORS: Record<string, string> = {
  src: '#1E88E5',
  app: '#3949AB',
  backend: '#00897B',
  frontend: '#FB8C00',
  api: '#00ACC1',
  core: '#546E7A',
  config: '#8E24AA',
  services: '#43A047',
  models: '#26A69A',
  routes: '#00ACC1',
  controllers: '#26C6DA',
  middleware: '#26A69A',
  components: '#5E35B1',
  pages: '#7E57C2',
  hooks: '#8E24AA',
  store: '#039BE5',
  utils: '#6D4C41',
  lib: '#6D4C41',
  types: '#5C6BC0',
  public: '#43A047',
  assets: '#F4511E',
  static: '#F57C00',
  styles: '#D81B60',
  css: '#1572B6',
  scss: '#C2185B',
  sass: '#AD1457',
  images: '#EC407A',
  scripts: '#689F38',
  test: '#EF5350',
  tests: '#EF5350',
  '__tests__': '#E53935',
  docs: '#3949AB',
  doc: '#3949AB',
  examples: '#FFB300',
  samples: '#FFB300',
  build: '#455A64',
  dist: '#455A64',
  out: '#455A64',
  node_modules: '#66BB6A',
  vendor: '#8D6E63',
  venv: '#2E7D32',
  '.venv': '#2E7D32',
  env: '#2E7D32',
  '.github': '#24292E',
  '.gitlab': '#FC6D26',
  '.vscode': '#007ACC',
  docker: '#0DB7ED',
  kubernetes: '#326CE5',
  k8s: '#326CE5',
  migrations: '#7B1FA2',
  database: '#336791',
  db: '#336791',
}

const SPECIAL_FILE_COLORS: Record<string, string> = {
  '.env': '#2E7D32',
  '.env.local': '#2E7D32',
  '.env.development': '#2E7D32',
  '.env.production': '#2E7D32',
  'dockerfile': '#0DB7ED',
  'docker-compose.yml': '#0DB7ED',
  'docker-compose.yaml': '#0DB7ED',
  'package.json': '#CB3837',
  'package-lock.json': '#A02424',
  'pnpm-lock.yaml': '#F69220',
  'yarn.lock': '#2C8EBB',
  'tsconfig.json': '#3178C6',
  'vite.config.ts': '#646CFF',
  'next.config.js': '#111111',
  'next.config.ts': '#111111',
  'readme.md': '#0A66C2',
  'makefile': '#6D4C41',
}

export const CATEGORY_COLORS = {
  code: '#007AFF',
  doc: '#5856D6',
  resource: '#FF9500',
  other: '#5E6A7A',
}

const FALLBACK_DIR_PALETTE = [
  '#42A5F5', '#26C6DA', '#66BB6A', '#FFCA28', '#FFA726', '#EC407A', '#AB47BC', '#7E57C2',
]

function hashToIndex(value: string, length: number): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % length
}

function getDirectoryColor(node: FileNode): string {
  const key = node.name.toLowerCase()
  if (DIRECTORY_COLORS[key]) return DIRECTORY_COLORS[key]
  return FALLBACK_DIR_PALETTE[hashToIndex(key || node.path, FALLBACK_DIR_PALETTE.length)]
}

function getFileColor(node: FileNode): string {
  const lowerName = node.name.toLowerCase()
  if (SPECIAL_FILE_COLORS[lowerName]) return SPECIAL_FILE_COLORS[lowerName]

  const ext = (node.extension ?? '').toLowerCase()
  if (ext && FILE_TYPE_COLORS[ext]) return FILE_TYPE_COLORS[ext]

  const meta = node.metadata as { category?: string }
  const cat = meta?.category ?? 'other'
  return CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ?? CATEGORY_COLORS.other
}

export function getTypeColor(node: FileNode): string {
  if (node.type === 'directory') return getDirectoryColor(node)
  return getFileColor(node)
}

export function getCategoryColor(node: FileNode): string {
  if (node.type === 'directory') return getDirectoryColor(node)

  const ext = (node.extension ?? '').toLowerCase()
  if (ext && FILE_TYPE_COLORS[ext]) return FILE_TYPE_COLORS[ext]

  const lowerName = node.name.toLowerCase()
  if (SPECIAL_FILE_COLORS[lowerName]) return SPECIAL_FILE_COLORS[lowerName]

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
