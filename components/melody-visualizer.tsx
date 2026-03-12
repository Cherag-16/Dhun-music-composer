'use client'

import { useEffect, useRef } from 'react'

interface MelodyVisualizerProps {
  melody: Array<{
    note: string
    frequency: number
    duration: number
    octave: number
  }>
}

export default function MelodyVisualizer({ melody }: MelodyVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || melody.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 300

    // Background
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const y = (canvas.height / 10) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Find frequency range
    const frequencies = melody.map((n) => n.frequency)
    const minFreq = Math.min(...frequencies)
    const maxFreq = Math.max(...frequencies)
    const freqRange = maxFreq - minFreq || 1

    // Draw melody line
    const noteWidth = canvas.width / melody.length
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()

    melody.forEach((note, index) => {
      const x = (index + 0.5) * noteWidth
      const normalized = (note.frequency - minFreq) / freqRange
      const y = canvas.height - normalized * (canvas.height * 0.8) - 30

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw note points
    ctx.fillStyle = '#3b82f6'
    melody.forEach((note, index) => {
      const x = (index + 0.5) * noteWidth
      const normalized = (note.frequency - minFreq) / freqRange
      const y = canvas.height - normalized * (canvas.height * 0.8) - 30

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw note name
      ctx.fillStyle = '#1f2937'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(note.note, x, y - 12)
    })

    // Draw frequency labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${maxFreq.toFixed(0)} Hz`, canvas.width - 10, 20)
    ctx.fillText(`${minFreq.toFixed(0)} Hz`, canvas.width - 10, canvas.height - 10)
  }, [melody])

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-primary/10 bg-white"
        style={{ maxHeight: '300px' }}
      />
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-foreground/60">Total Notes:</span>
          <span className="ml-2 font-semibold">{melody.length}</span>
        </div>
        <div>
          <span className="text-foreground/60">Frequency Range:</span>
          <span className="ml-2 font-semibold">
            {Math.min(...melody.map((n) => n.frequency)).toFixed(0)} -
            {Math.max(...melody.map((n) => n.frequency)).toFixed(0)} Hz
          </span>
        </div>
      </div>
    </div>
  )
}
