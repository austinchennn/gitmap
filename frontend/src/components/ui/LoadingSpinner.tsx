'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export default function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizes = {
    sm: 20,
    md: 32,
    lg: 48,
  }

  const s = sizes[size]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: s, height: s }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-apple-blue"
            style={{
              width: s * 0.1,
              height: s * 0.28,
              top: '50%',
              left: '50%',
              transformOrigin: `0 ${-s * 0.28}px`,
              transform: `rotate(${i * 30}deg) translateX(-50%)`,
            }}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * (1 / 12),
              ease: 'linear',
            }}
          />
        ))}
      </div>
      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-apple-gray-500 text-sm"
        >
          {label}
        </motion.p>
      )}
    </div>
  )
}
