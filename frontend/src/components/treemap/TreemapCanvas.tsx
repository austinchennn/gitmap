'use client'

import { useRef, useEffect, useCallback, memo } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { useGitMapStore } from '@/store/useGitMapStore'
import { FileNode } from '@/types'
import { computeTreemap, formatSize } from '@/utils/d3-helpers'
import { getNodeColor } from '@/utils/color-scale'

interface TreemapCanvasProps {
  data: FileNode
}

const DEBOUNCE_MS = 30

function TreemapCanvas({ data }: TreemapCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const { setHoveredNode, viewMode, drillDown } = useGitMapStore()

  const render = useCallback(() => {
    const svg = svgRef.current
    const container = containerRef.current
    if (!svg || !container) return

    const width = container.clientWidth
    const height = container.clientHeight
    if (width <= 0 || height <= 0) return

    // Clear previous
    d3.select(svg).selectAll('*').remove()

    const root = computeTreemap(data, width, height)

    const g = d3.select(svg)
      .attr('width', width)
      .attr('height', height)

    // Render leaves only
    const leaves = root.leaves()

    const cell = g.selectAll<SVGGElement, d3.HierarchyRectangularNode<FileNode>>('g')
      .data(leaves)
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`)

    // Rects with rounded corners
    cell.append('rect')
      .attr('width', (d) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d) => Math.max(0, d.y1 - d.y0))
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', (d) => getNodeColor(d.data, viewMode))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('class', 'treemap-rect cursor-pointer')

    // Labels for larger cells
    cell.each(function(d) {
      const w = d.x1 - d.x0
      const h = d.y1 - d.y0
      if (w < 40 || h < 24) return

      const cellSel = d3.select(this)

      const fo = cellSel.append('foreignObject')
        .attr('x', 4)
        .attr('y', 3)
        .attr('width', w - 8)
        .attr('height', h - 6)
        .style('pointer-events', 'none')

      const div = fo.append('xhtml:div')
        .style('width', '100%')
        .style('height', '100%')
        .style('overflow', 'hidden')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('justify-content', 'flex-end')
        .style('padding', '3px')

      div.append('xhtml:div')
        .style('font-size', w > 80 ? '11px' : '9px')
        .style('font-weight', '600')
        .style('color', 'rgba(0,0,0,0.75)')
        .style('font-family', '-apple-system, BlinkMacSystemFont, sans-serif')
        .style('line-height', '1.3')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .style('white-space', 'nowrap')
        .text(d.data.name)

      if (h > 40 && w > 60) {
        div.append('xhtml:div')
          .style('font-size', '9px')
          .style('color', 'rgba(0,0,0,0.45)')
          .style('font-family', '-apple-system, BlinkMacSystemFont, sans-serif')
          .style('margin-top', '1px')
          .text(formatSize(d.data.size))
      }
    })

    // Mouse events
    cell
      .on('mousemove', function(event: MouseEvent, d) {
        clearTimeout(hoverTimerRef.current)
        hoverTimerRef.current = setTimeout(() => {
          setHoveredNode({
            node: d.data,
            x: event.clientX,
            y: event.clientY,
          })
        }, DEBOUNCE_MS)
      })
      .on('mouseleave', function() {
        clearTimeout(hoverTimerRef.current)
        setHoveredNode(null)
      })
      .on('click', function(event: MouseEvent, d) {
        event.stopPropagation()
        drillDown(d.data)
      })

    // Draw parent labels
    const nodes = root.descendants().filter(d => d.depth > 0 && d.children)
    g.selectAll('.parent-label')
      .data(nodes)
      .join('text')
      .attr('class', 'parent-label')
      .attr('x', (d) => d.x0 + 4)
      .attr('y', (d) => d.y0 + 13)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', 'rgba(0,0,0,0.4)')
      .attr('font-family', '-apple-system, BlinkMacSystemFont, sans-serif')
      .text((d) => {
        const w = d.x1 - d.x0
        if (w < 30) return ''
        return d.data.name
      })

  }, [data, viewMode, setHoveredNode, drillDown])

  useEffect(() => {
    render()

    const observer = new ResizeObserver(() => render())
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [render])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full"
      onMouseLeave={() => setHoveredNode(null)}
    >
      <svg ref={svgRef} className="w-full h-full" />
    </motion.div>
  )
}

export default memo(TreemapCanvas)
