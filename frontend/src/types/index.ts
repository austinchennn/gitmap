export interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  size: number
  extension: string | null
  metadata: FileMetadata | DirectoryMetadata
  children?: FileNode[] | null
}

export interface FileMetadata {
  category: 'code' | 'resource' | 'doc' | 'other'
  isBinary: boolean
  authors?: Author[]
  earliestCommit?: string
  latestCommit?: string
}

export interface DirectoryMetadata {
  totalFiles: number
  codeFiles: number
  resourceFiles: number
  docFiles: number
  otherFiles: number
  codeRatio: number
  resourceRatio: number
}

export interface Author {
  login: string
  avatarUrl: string
  commits: number
}

export interface RepoAnalysis {
  repo_url: string
  owner: string
  repo: string
  default_branch: string
  tree: FileNode
  cached: boolean
}

export type ViewMode = 'default' | 'heatmap' | 'type'

export interface HoveredNode {
  node: FileNode
  x: number
  y: number
}
