'use client'

import { useState, useEffect } from 'react'
import { Music, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/navigation'

export default function RaagsPage() {
  const [raags, setRaags] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRaag, setSelectedRaag] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRaags()
  }, [])

  async function loadRaags() {
    try {
      const res = await fetch('/api/raags')
      const data = await res.json()
      setRaags(data)
    } catch (error) {
      console.error('Error loading raags:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRaags = raags.filter(
    (raag) =>
      raag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      raag.mood.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-3xl font-bold">Indian Raags</h1>
              <p className="text-foreground/60">
                Explore the foundation of Indian classical music
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="border-b border-primary/10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
            <Input
              placeholder="Search raags by name or mood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-primary/10 bg-background/50 pl-10"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Raag List */}
            <div className="space-y-3 lg:col-span-1">
              {loading ? (
                <p className="text-center text-foreground/60">Loading raags...</p>
              ) : filteredRaags.length === 0 ? (
                <p className="text-center text-foreground/60">No raags found</p>
              ) : (
                filteredRaags.map((raag) => (
                  <Card
                    key={raag.id}
                    onClick={() => setSelectedRaag(raag)}
                    className={`cursor-pointer border-primary/10 p-4 backdrop-blur-sm transition-all hover:border-primary/30 ${
                      selectedRaag?.id === raag.id
                        ? 'border-primary bg-primary/10'
                        : 'bg-card/50'
                    }`}
                  >
                    <h3 className="font-semibold">{raag.name}</h3>
                    <p className="text-sm text-foreground/60">{raag.mood}</p>
                  </Card>
                ))
              )}
            </div>

            {/* Raag Details */}
            <div className="lg:col-span-2">
              {selectedRaag ? (
                <Card className="border-primary/10 space-y-6 bg-card/50 p-8 backdrop-blur-sm">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedRaag.name}</h2>
                    <p className="mt-2 text-lg text-foreground/70">
                      {selectedRaag.description}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-accent/10 p-4">
                      <p className="text-sm text-foreground/60">Mood</p>
                      <p className="mt-1 font-semibold">{selectedRaag.mood}</p>
                    </div>
                    <div className="rounded-lg bg-accent/10 p-4">
                      <p className="text-sm text-foreground/60">Time Period</p>
                      <p className="mt-1 font-semibold">
                        {selectedRaag.time_period}
                      </p>
                    </div>
                    <div className="rounded-lg bg-accent/10 p-4">
                      <p className="text-sm text-foreground/60">Vadi</p>
                      <p className="mt-1 font-semibold">{selectedRaag.vadi}</p>
                    </div>
                    <div className="rounded-lg bg-accent/10 p-4">
                      <p className="text-sm text-foreground/60">Samvadi</p>
                      <p className="mt-1 font-semibold">
                        {selectedRaag.samvadi}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground/70">
                        Aroha (Ascending)
                      </p>
                      <p className="mt-2 text-2xl font-bold tracking-widest">
                        {selectedRaag.aroha}
                      </p>
                      <p className="mt-1 text-xs text-foreground/60">
                        Notes played in ascending order
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground/70">
                        Avaroha (Descending)
                      </p>
                      <p className="mt-2 text-2xl font-bold tracking-widest">
                        {selectedRaag.avaroha}
                      </p>
                      <p className="mt-1 text-xs text-foreground/60">
                        Notes played in descending order
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-sm text-foreground/70">
                      <strong>Note Legend:</strong> S = Shadaj (Do), R = Rishabh
                      (Re), G/g = Gandhar (Mi), M/m = Madhyam (Fa), P = Pancham
                      (Sol), D = Dhaivat (La), N/n = Nishad (Si)
                    </p>
                  </div>
                </Card>
              ) : (
                <Card className="border-primary/10 flex items-center justify-center bg-card/50 p-12 text-center backdrop-blur-sm">
                  <div>
                    <Music className="mx-auto mb-4 h-12 w-12 text-primary/30" />
                    <p className="text-foreground/60">
                      Select a raag to view details
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
