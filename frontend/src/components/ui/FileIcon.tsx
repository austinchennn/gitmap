import React from 'react'

interface FileIconProps {
  extension?: string | null
  type: string
  className?: string
}

export function FileIcon({ extension, type, className = "w-4 h-4" }: FileIconProps) {
  if (type === 'directory') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${className} text-blue-500`}
      >
        <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
      </svg>
    )
  }

  const ext = extension?.toLowerCase() || ''

  // Code files
  if (['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.c', '.cpp', '.h', '.css', '.scss', '.html', '.php', '.rb', '.lua', '.sql', '.sh', '.bash'].includes(ext)) {
    let color = "text-gray-500"
    if (['.ts', '.tsx'].includes(ext)) color = "text-blue-600"
    if (['.js', '.jsx'].includes(ext)) color = "text-yellow-500"
    if (['.py'].includes(ext)) color = "text-blue-500"
    if (['.css', '.scss', '.html'].includes(ext)) color = "text-orange-500"
    if (['.rs'].includes(ext)) color = "text-orange-700"
    if (['.go'].includes(ext)) color = "text-cyan-600"
    
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} ${color}`}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="m9 15 2 2 4-4" /> 
        {/* Simple "code-like" or checkmark is not right. Let's use generic file with code braces if possible, or just file text */}
      </svg>
    )
  }

  // Define specific icons for broad categories
  // For code, I want a file with code symbol < >
  const CodeIcon = ({ color }: { color: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} ${color}`}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="10 13 8 15 10 17" />
      <polyline points="14 13 16 15 14 17" />
    </svg>
  )

  if (['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.c', '.cpp', '.h', '.css', '.scss', '.html', '.php', '.rb', '.lua', '.sql', '.sh', '.bash'].includes(ext)) {
     let color = "text-gray-500"
     if (['.ts', '.tsx'].includes(ext)) color = "text-blue-600"
     if (['.js', '.jsx'].includes(ext)) color = "text-yellow-500"
     if (['.py'].includes(ext)) color = "text-blue-500" // Python usually blue/yellow
     if (['.css', '.scss', '.html', '.xml'].includes(ext)) color = "text-orange-500"
     if (['.rs'].includes(ext)) color = "text-orange-700"
     if (['.go'].includes(ext)) color = "text-cyan-600"
     if (['.java'].includes(ext)) color = "text-red-600"
     return <CodeIcon color={color} />
  }
  
  // Config / Data
  if (['.json', '.yaml', '.yml', '.toml', '.env', '.gitignore', '.config.js'].includes(ext)) {
    return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} text-yellow-600`}>
         <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
         <polyline points="14 2 14 8 20 8" />
         <circle cx="10" cy="13" r="2" />
         <path d="m20 17-2.5 2.5" />
       </svg>
    )
  }

  // Images
  if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'].includes(ext)) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} text-purple-500`}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <rect x="7" y="12" width="10" height="7" rx="1" />
      </svg>
    )
  }
  
  // Audio/Video
  if (['.mp3', '.wav', '.mp4', '.mov', '.avi'].includes(ext)) {
     return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} text-pink-500`}>
         <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
         <polyline points="14 2 14 8 20 8" />
         <path d="M10 13v6" />
         <path d="M14 13v6" />
       </svg>
     )
  }

  // Markdown / Text
  if (['.md', '.mdx', '.txt', '.rtf'].includes(ext)) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} text-gray-500`}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    )
  }

  // Default File
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} text-gray-400`}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
