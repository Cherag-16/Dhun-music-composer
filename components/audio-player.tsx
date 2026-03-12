'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface AudioPlayerProps {
  melody: Array<{
    note: string
    frequency: number
    duration: number
    octave: number
  }>
  instrument: string
  onPlayingChange?: (isPlaying: boolean) => void
}

export default function AudioPlayer({
  melody,
  instrument,
  onPlayingChange,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const gainNodesRef = useRef<GainNode[]>([])
  const progressIntervalRef = useRef<number | null>(null)
  const playStartTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)()
      } catch (err) {
        setError('Web Audio API not supported')
        console.error('AudioContext error:', err)
      }
    }

    // Calculate total duration
    const totalDuration = melody.reduce((sum, note) => sum + note.duration * 0.5, 0)
    setDuration(totalDuration)
  }, [melody])

  const stopMelody = () => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop()
      } catch (e) {
        // Already stopped
      }
    })
    oscillatorsRef.current = []
    gainNodesRef.current = []
  }

  const playMelody = async () => {
    if (!audioContextRef.current || melody.length === 0) {
      setError('No melody to play')
      return
    }

    try {
      setError(null)
      const ctx = audioContextRef.current
      await ctx.resume()

      stopMelody()

      // Create master gain for volume control
      const masterGain = ctx.createGain()
      masterGain.gain.value = volume / 100
      masterGain.connect(ctx.destination)

      // Add reverb effect for Indian classical sound
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 5000
      filter.Q.value = 2
      filter.connect(masterGain)

      const now = ctx.currentTime
      let currentTime = now + 0.05

      // Play each note in the melody
      melody.forEach((note) => {
        const noteDuration = note.duration * 0.5

        // Create oscillator for this note
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        // Configure instrument type for richer sounds
        const getOscillatorType = (inst: string): OscillatorType => {
          switch (inst) {
            case 'Sitar':
              return 'triangle'
            case 'Sarangi':
              return 'square'
            case 'Violin':
              return 'sawtooth'
            case 'Bansuri':
              return 'sine'
            case 'Harmonium':
              return 'sine'
            default:
              return 'sine'
          }
        }

        osc.type = getOscillatorType(instrument)
        osc.frequency.setValueAtTime(note.frequency, currentTime)

        // ADSR envelope for natural sound
        gain.gain.setValueAtTime(0, currentTime)
        gain.gain.linearRampToValueAtTime(0.8, currentTime + 0.05) // Attack
        gain.gain.exponentialRampToValueAtTime(0.1, currentTime + noteDuration - 0.05) // Decay/Release
        gain.gain.linearRampToValueAtTime(0, currentTime + noteDuration)

        osc.connect(gain)
        gain.connect(filter)

        osc.start(currentTime)
        osc.stop(currentTime + noteDuration)

        oscillatorsRef.current.push(osc)
        gainNodesRef.current.push(gain)

        currentTime += noteDuration
      })

      playStartTimeRef.current = ctx.currentTime
      setIsPlaying(true)
      onPlayingChange?.(true)

      // Update progress
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = window.setInterval(() => {
        const elapsed = (ctx.currentTime - playStartTimeRef.current) * 1000
        const prog = Math.min(elapsed / (duration * 1000), 1)
        setProgress(prog)

        if (prog >= 1) {
          setIsPlaying(false)
          onPlayingChange?.(false)
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
        }
      }, 100)
    } catch (err) {
      console.error('Error playing melody:', err)
      setError('Error playing audio')
      setIsPlaying(false)
      onPlayingChange?.(false)
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      stopMelody()
      setIsPlaying(false)
      onPlayingChange?.(false)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    } else {
      playMelody()
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioContextRef.current) {
      // Update master gain if playing
      const ctx = audioContextRef.current
      const destination = ctx.destination as any
      if (destination.gain) {
        destination.gain.value = newVolume / 100
      }
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex gap-2 rounded bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          onClick={togglePlay}
          disabled={melody.length === 0}
          className="gap-2"
          size="lg"
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Play Dhun
            </>
          )}
        </Button>

        <div className="flex-1">
          <div className="mb-2 h-1 rounded-full bg-primary/20">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-foreground/60">
            <span>{(progress * duration).toFixed(1)}s</span>
            <span>{duration.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Volume2 className="h-4 w-4 text-foreground/60" />
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          min={0}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="w-10 text-right text-sm text-foreground/60">{volume}%</span>
      </div>

      <p className="text-xs text-foreground/50">
        Notes: {melody.length} | Duration: {duration.toFixed(1)}s | Instrument: {instrument}
      </p>
    </div>
  )
}
