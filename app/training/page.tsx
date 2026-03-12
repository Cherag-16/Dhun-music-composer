'use client'

import { useState } from 'react'
import { Brain, Plus, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Navigation from '@/components/navigation'

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<'add' | 'data'>('add')
  const [isLoading, setIsLoading] = useState(false)
  const [trainingSongs, setTrainingSongs] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    movie: '',
    lyrics: '',
    original_melody: '',
    raag: '',
    category: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTrainingData = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/training/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Training song added successfully!')
        setFormData({
          title: '',
          artist: '',
          movie: '',
          lyrics: '',
          original_melody: '',
          raag: '',
          category: '',
        })
        // Reload training songs
        loadTrainingSongs()
      }
    } catch (error) {
      console.error('Error adding training data:', error)
      alert('Failed to add training song')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrainingSongs = async () => {
    try {
      const response = await fetch('/api/training/songs')
      if (response.ok) {
        const data = await response.json()
        setTrainingSongs(data)
      }
    } catch (error) {
      console.error('Error loading training songs:', error)
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
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Train the System</h1>
              <p className="text-foreground/60">
                Teach the AI about popular Bollywood songs and their compositions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-primary/10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-4 py-4">
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'add'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Add Training Data
            </button>
            <button
              onClick={() => {
                setActiveTab('data')
                loadTrainingSongs()
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'data'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Training Dataset
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {activeTab === 'add' ? (
            /* Add Training Data Form */
            <Card className="border-primary/10 bg-card/50 p-8 backdrop-blur-sm">
              <h2 className="mb-6 text-2xl font-bold">Add Training Song</h2>

              <form onSubmit={handleAddTrainingData} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Song Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Tum Hi Ho"
                      className="border-primary/10 bg-background/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Artist
                    </label>
                    <Input
                      name="artist"
                      value={formData.artist}
                      onChange={handleInputChange}
                      placeholder="e.g., Arijit Singh"
                      className="border-primary/10 bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Movie
                    </label>
                    <Input
                      name="movie"
                      value={formData.movie}
                      onChange={handleInputChange}
                      placeholder="e.g., Aashiqui 2"
                      className="border-primary/10 bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Raag
                    </label>
                    <Input
                      name="raag"
                      value={formData.raag}
                      onChange={handleInputChange}
                      placeholder="e.g., Yaman"
                      className="border-primary/10 bg-background/50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-primary/10 bg-background/50 px-3 py-2 text-foreground"
                    >
                      <option value="">Select Category</option>
                      <option value="Romantic">Romantic</option>
                      <option value="Bhajan">Bhajan</option>
                      <option value="Patriotic">Patriotic</option>
                      <option value="Gazal">Gazal</option>
                      <option value="Sad">Sad</option>
                      <option value="Folk">Folk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Lyrics <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="lyrics"
                    value={formData.lyrics}
                    onChange={handleInputChange}
                    placeholder="Paste the song lyrics here..."
                    rows={4}
                    className="border-primary/10 bg-background/50 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Original Melody (Note Sequence)
                  </label>
                  <Textarea
                    name="original_melody"
                    value={formData.original_melody}
                    onChange={handleInputChange}
                    placeholder="e.g., S R G M P (note sequence of the original dhun)"
                    rows={3}
                    className="border-primary/10 bg-background/50 resize-none"
                  />
                  <p className="mt-1 text-xs text-foreground/60">
                    Optional: Help the system learn the exact melody pattern
                  </p>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Add Training Song
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 rounded-lg bg-accent/10 p-4">
                <p className="text-sm text-foreground/70">
                  <strong>💡 Tip:</strong> Add popular Bollywood songs with their
                  original melodies. The system will learn from these examples to
                  create better compositions in the future.
                </p>
              </div>
            </Card>
          ) : (
            /* Training Dataset */
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Training Dataset</h2>
              {trainingSongs.length === 0 ? (
                <Card className="border-primary/10 bg-card/50 p-8 text-center backdrop-blur-sm">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-primary/30" />
                  <p className="text-foreground/60">
                    No training songs yet. Add some to start training the system.
                  </p>
                </Card>
              ) : (
                trainingSongs.map((song) => (
                  <Card
                    key={song.id}
                    className="border-primary/10 bg-card/50 p-6 backdrop-blur-sm"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-foreground/60">Title</p>
                        <p className="font-semibold">{song.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Artist</p>
                        <p className="font-semibold">{song.artist || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Movie</p>
                        <p className="font-semibold">{song.movie || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Category</p>
                        <p className="font-semibold">{song.category}</p>
                      </div>
                    </div>
                    {song.lyrics && (
                      <div className="mt-4">
                        <p className="text-sm text-foreground/60">Lyrics</p>
                        <p className="mt-1 line-clamp-2 text-sm">
                          {song.lyrics}
                        </p>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
