'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useGitMapStore } from '@/store/useGitMapStore'
import SearchBar from '@/components/ui/SearchBar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import PathBar from '@/components/ui/PathBar'
import TreemapCanvas from '@/components/treemap/TreemapCanvas'
import InspectorPopup from '@/components/treemap/InspectorPopup'
import FileTree from '@/components/sidebar/FileTree'
import ViewToggle from '@/components/ui/ViewToggle'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function HomePage() {
  const {
    repoData,
    isLoading,
    error,
    searchExpanded,
    hoveredNode,
    drillPath,
    setRepoData,
    setLoading,
    setError,
    setSearchExpanded,
  } = useGitMapStore()

  const handleSearch = async (url: string) => {
    setLoading(true)
    setError(null)
    setSearchExpanded(true)

    try {
      const response = await fetch(
        `${API_BASE}/api/analyze?repo_url=${encodeURIComponent(url)}`
      )

      if (response.status === 429) {
        const data = await response.json()
        throw new Error(data.detail?.message || 'Rate limit exceeded. Please try again later.')
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to analyze repository')
      }

      const data = await response.json()
      setRepoData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const currentTreeNode = drillPath[drillPath.length - 1]

  return (
    <div className="min-h-screen bg-apple-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <motion.nav
        initial={false}
        className="fixed top-0 left-0 right-0 z-50 h-12 backdrop-blur-xl bg-white/80 border-b border-black/5 shadow-apple-sm"
      >
        <div className="flex items-center h-full px-4 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-fit">
            <div className="w-6 h-6 rounded-lg bg-apple-blue flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" fillOpacity="0.7"/>
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" fillOpacity="0.7"/>
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" fillOpacity="0.4"/>
              </svg>
            </div>
            <span className="font-semibold text-sm text-apple-gray-950">GitMap</span>
          </div>

          {/* Search Bar in Nav (when expanded) */}
          <AnimatePresence>
            {searchExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                exit={{ opacity: 0, scale: 0.95, width: 0 }}
                className="flex-1 max-w-md"
              >
                <SearchBar compact onSearch={handleSearch} />
              </motion.div>
            )}
          </AnimatePresence>

          {repoData && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 min-w-0"
            >
              <PathBar />
            </motion.div>
          )}

          {/* View Toggle */}
          {repoData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-auto"
            >
              <ViewToggle />
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 pt-12">
        <AnimatePresence mode="wait">
          {!searchExpanded && !repoData ? (
            /* Hero / Search Page */
            <motion.div
              key="hero"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] px-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center mb-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-apple-blue mx-auto mb-4 flex items-center justify-center shadow-apple-lg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" fill="white"/>
                    <rect x="18" y="2" width="12" height="12" rx="2" fill="white" fillOpacity="0.7"/>
                    <rect x="2" y="18" width="12" height="12" rx="2" fill="white" fillOpacity="0.7"/>
                    <rect x="18" y="18" width="12" height="12" rx="2" fill="white" fillOpacity="0.4"/>
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-apple-gray-950 tracking-tight">GitMap</h1>
                <p className="text-apple-gray-500 mt-2 text-lg">
                  Explore any GitHub repository as an interactive treemap
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full max-w-lg"
              >
                <SearchBar onSearch={handleSearch} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex gap-2 text-sm text-apple-gray-400"
              >
                <span>Try:</span>
                {['facebook/react', 'vercel/next.js', 'microsoft/vscode'].map((example) => (
                  <button
                    key={example}
                    onClick={() => handleSearch(`https://github.com/${example}`)}
                    className="text-apple-blue hover:opacity-70 transition-opacity"
                  >
                    {example}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            /* Main Visualization Page */
            <motion.div
              key="visualization"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-[calc(100vh-48px)]"
            >
              {/* Sidebar */}
              <motion.aside
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-64 border-r border-black/5 bg-white/70 backdrop-blur-md overflow-hidden flex flex-col"
              >
                {repoData && (
                  <>
                    <div className="p-3 border-b border-black/5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-apple-blue/10 flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1z" fill="#007AFF"/>
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-apple-gray-600 truncate">
                          {repoData.owner}/{repoData.repo}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <FileTree data={repoData.tree} />
                    </div>
                  </>
                )}
              </motion.aside>

              {/* Main Canvas */}
              <div className="flex-1 relative overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="bg-white rounded-2xl shadow-apple-lg p-8 max-w-md text-center">
                      <div className="text-4xl mb-3">⚠️</div>
                      <h3 className="font-semibold text-apple-gray-900 mb-2">Unable to Load Repository</h3>
                      <p className="text-apple-gray-500 text-sm">{error}</p>
                      <button
                        onClick={() => {
                          useGitMapStore.getState().setError(null)
                          useGitMapStore.getState().setSearchExpanded(false)
                        }}
                        className="mt-4 px-4 py-2 bg-apple-blue text-white rounded-xl text-sm font-medium hover:bg-apple-blue-dark transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                ) : currentTreeNode ? (
                  <TreemapCanvas data={currentTreeNode} />
                ) : null}

                {/* Floating Inspector */}
                {hoveredNode && <InspectorPopup />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && searchExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-white/60 backdrop-blur-sm"
          >
            <LoadingSpinner size="lg" label="Analyzing repository..." />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
