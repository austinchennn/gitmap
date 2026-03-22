import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitMap - GitHub Repository Visualizer',
  description: 'Explore GitHub repositories with an Apple-style interactive treemap visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
