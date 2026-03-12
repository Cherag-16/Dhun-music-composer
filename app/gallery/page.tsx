'use client'

import { useState, useEffect } from 'react'
import { Music, Search, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/navigation'

export default function GalleryPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [filteredSongs, setFilteredSongs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const categories = ['All', 'Romantic', 'Bhajan', 'Patriotic', 'Gazal', 'Sad']

  useEffect(() => {
    loadSongs()
  }, [])

  useEffect(() => {
    filterSongs()
  }, [songs, searchTerm, selectedCategory])

  async function loadSongs() {
    try {
      const res = await fetch('/api/gallery/songs')
      const data = await res.json()
      setSongs(data || [])
    } catch (error) {
      console.error('Error loading songs:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterSongs() {
    let filtered = songs

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((song) => song.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.raag_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredSongs(filtered)
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
              <h1 className="text-3xl font-bold">Composition Gallery</h1>
              <p className="text-foreground/60">
                Explore all generated compositions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-primary/10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
            <Input
              placeholder="Search compositions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-primary/10 bg-background/50 pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-primary/20 text-foreground/70 hover:border-primary/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center text-foreground/60">
              Loading compositions...
            </div>
          ) : filteredSongs.length === 0 ? (
            <div className="text-center">
              <Music className="mx-auto mb-4 h-12 w-12 text-primary/30" />
              <p className="text-foreground/60">
                {songs.length === 0
                  ? 'No compositions yet. Create one on the Compose page!'
                  : 'No compositions match your filters.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSongs.map((song) => (
                <Card
                  key={song.id}
                  className="group border-primary/10 overflow-hidden bg-card/50 transition-all hover:border-primary/30 hover:shadow-lg backdrop-blur-sm"
                >
                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="font-bold line-clamp-2">{song.title}</h3>
                      <p className="text-sm text-foreground/60">
                        {song.raag_name}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {song.category}
                      </span>
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        {song.mood}
                      </span>
                    </div>

                    <div className="text-xs text-foreground/60">
                      <p>Instrument: {song.instrument}</p>
                      <p>
                        Composed:{' '}
                        {new Date(song.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="rounded-lg bg-accent/5 p-3">
                      <p className="line-clamp-3 text-xs text-foreground/70">
                        {song.lyrics}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
