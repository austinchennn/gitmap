'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGitMapStore } from '@/store/useGitMapStore'

interface SearchBarProps {
  onSearch: (url: string) => void
  compact?: boolean
}

export default function SearchBar({ onSearch, compact = false }: SearchBarProps) {
  const { repoUrl, setRepoUrl } = useGitMapStore()
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!compact) {
      inputRef.current?.focus()
    }
  }, [compact])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = repoUrl.trim()
    if (!url) return

    // Auto-prefix github.com if needed
    const finalUrl = url.startsWith('http') ? url : `https://github.com/${url}`
    onSearch(finalUrl)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 4px rgba(0,122,255,0.15), 0 4px 16px rgba(0,0,0,0.08)'
            : '0 2px 8px rgba(0,0,0,0.06)',
        }}
        transition={{ duration: 0.2 }}
        className={`
          flex items-center gap-2 bg-white rounded-2xl overflow-hidden
          border border-black/8 transition-colors
          ${focused ? 'border-apple-blue/50' : ''}
          ${compact ? 'h-8 px-3' : 'h-12 px-4'}
        `}
      >
        {/* Search Icon */}
        <svg
          width={compact ? 14 : 16}
          height={compact ? 14 : 16}
          viewBox="0 0 16 16"
          fill="none"
          className="text-apple-gray-400 flex-shrink-0"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={compact ? 'Search repository...' : 'github.com/owner/repo'}
          className={`
            flex-1 bg-transparent outline-none text-apple-gray-900 placeholder-apple-gray-300
            ${compact ? 'text-sm' : 'text-base'}
          `}
        />

        {repoUrl && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={() => setRepoUrl('')}
            className="text-apple-gray-300 hover:text-apple-gray-500 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" fill="currentColor" fillOpacity="0.15"/>
              <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </motion.button>
        )}

        {!compact && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="bg-apple-blue text-white rounded-xl px-4 py-1.5 text-sm font-medium hover:bg-apple-blue-dark transition-colors flex-shrink-0"
          >
            Analyze
          </motion.button>
        )}
      </motion.div>
    </form>
  )
}
