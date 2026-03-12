'use client'

import { useState, useEffect } from 'react'
import { Music, Play, Pause, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Navigation from '@/components/navigation'
import CompositionForm from '@/components/composition-form'
import MelodyVisualizer from '@/components/melody-visualizer'
import AudioPlayer from '@/components/audio-player'

export default function ComposePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [melody, setMelody] = useState<any[]>([])
  const [composition, setComposition] = useState<any>(null)
  const [raags, setRaags] = useState<any[]>([])
  const [instruments, setInstruments] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [raagRes, instrumentRes, categoryRes] = await Promise.all([
        fetch('/api/raags'),
        fetch('/api/instruments'),
        fetch('/api/categories'),
      ])

      if (raagRes.ok) setRaags(await raagRes.json())
      if (instrumentRes.ok) setInstruments(await instrumentRes.json())
      if (categoryRes.ok) setCategories(await categoryRes.json())
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  async function handleCompose(formData: any) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setComposition(data)
        setMelody(data.melody)
        setSuccess('Dhun composed successfully! Click play to hear your melody.')
      } else {
        const errorText = await response.text()
        setError(`Failed to compose: ${errorText}`)
      }
    } catch (error) {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDownload() {
    if (!composition) return

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ composition }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${composition.title || 'composition'}.wav`
        a.click()
      }
    } catch (error) {
      console.error('Error downloading:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />

      {/* Header */}
      <section className="border-b border-primary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Compose Dhun</h1>
              <p className="text-foreground/60">
                Create beautiful classical melodies from your lyrics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <p className="font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-700 dark:text-green-400">
              <p className="font-medium">{success}</p>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Composition Form */}
            <div className="lg:col-span-1">
              <CompositionForm
                raags={raags}
                instruments={instruments}
                categories={categories}
                onCompose={handleCompose}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column - Preview and Player */}
            <div className="lg:col-span-2 space-y-6">
              {composition ? (
                <>
                  {/* Composition Info Card */}
                  <Card className="border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">{composition.title}</h2>
                        <p className="text-foreground/70">{composition.raag_name}</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-foreground/60">Mood</p>
                          <p className="font-semibold">{composition.mood}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Category</p>
                          <p className="font-semibold">{composition.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Instrument</p>
                          <p className="font-semibold">{composition.instrument}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Duration</p>
                          <p className="font-semibold">
                            {(melody.length * 0.5).toFixed(1)}s
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm text-foreground/60">Lyrics</p>
                        <p className="rounded bg-accent/10 p-3 text-sm">
                          {composition.lyrics}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Melody Visualizer */}
                  {melody.length > 0 && (
                    <Card className="border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
                      <h3 className="mb-4 font-semibold">Melody Visualization</h3>
                      <MelodyVisualizer melody={melody} />
                    </Card>
                  )}

                  {/* Audio Player */}
                  <Card className="border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
                    <AudioPlayer
                      melody={melody}
                      instrument={composition.instrument}
                      onPlayingChange={setIsPlaying}
                    />
                  </Card>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Export Composition
                  </Button>
                </>
              ) : (
                <Card className="border-primary/10 bg-card/50 p-8 text-center backdrop-blur-sm">
                  <Music className="mx-auto mb-4 h-12 w-12 text-primary/30" />
                  <p className="text-foreground/60">
                    Fill in the form and click "Compose" to create your dhun
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
