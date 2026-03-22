import { create } from 'zustand'
import { FileNode, RepoAnalysis, ViewMode, HoveredNode } from '@/types'

interface GitMapState {
  // Data
  repoData: RepoAnalysis | null
  isLoading: boolean
  error: string | null
  
  // UI State
  repoUrl: string
  searchExpanded: boolean
  currentNode: FileNode | null
  hoveredNode: HoveredNode | null
  viewMode: ViewMode
  drillPath: FileNode[]
  
  // Actions
  setRepoUrl: (url: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setRepoData: (data: RepoAnalysis | null) => void
  setSearchExpanded: (expanded: boolean) => void
  setCurrentNode: (node: FileNode | null) => void
  setHoveredNode: (node: HoveredNode | null) => void
  setViewMode: (mode: ViewMode) => void
  drillDown: (node: FileNode) => void
  drillUp: () => void
  jumpToDepth: (depth: number) => void
  resetDrill: () => void
}

export const useGitMapStore = create<GitMapState>((set, get) => ({
  repoData: null,
  isLoading: false,
  error: null,
  repoUrl: '',
  searchExpanded: false,
  currentNode: null,
  hoveredNode: null,
  viewMode: 'default',
  drillPath: [],

  setRepoUrl: (url) => set({ repoUrl: url }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setRepoData: (data) => set({ repoData: data, drillPath: data ? [data.tree] : [] }),
  setSearchExpanded: (expanded) => set({ searchExpanded: expanded }),
  setCurrentNode: (node) => set({ currentNode: node }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  setViewMode: (mode) => set({ viewMode: mode }),
  
  drillDown: (node) => {
    if (node.type === 'directory' && node.children) {
      set((state) => ({ drillPath: [...state.drillPath, node] }))
    }
  },
  
  drillUp: () => {
    set((state) => {
      if (state.drillPath.length <= 1) return state
      return { drillPath: state.drillPath.slice(0, -1) }
    })
  },

  jumpToDepth: (depth) => {
    set((state) => {
      if (depth < 0 || depth >= state.drillPath.length) return state
      return { drillPath: state.drillPath.slice(0, depth + 1) }
    })
  },

  resetDrill: () => {
    const { repoData } = get()
    set({ drillPath: repoData ? [repoData.tree] : [] })
  },
}))
