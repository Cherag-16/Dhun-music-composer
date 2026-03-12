'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface CompositionFormProps {
  raags: any[]
  instruments: any[]
  categories: any[]
  onCompose: (formData: any) => void
  isLoading: boolean
}

export default function CompositionForm({
  raags,
  instruments,
  categories,
  onCompose,
  isLoading,
}: CompositionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    lyrics: '',
    raag_id: '',
    category: '',
    instrument_id: '',
    tempo: 120,
    auto_detect_mood: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.lyrics.trim()) {
      alert('Please enter lyrics')
      return
    }
    
    // Auto-select first raag if not selected
    let submitData = { ...formData }
    if (!submitData.raag_id && raags.length > 0) {
      submitData.raag_id = raags[0].id
    }
    
    // Auto-select first instrument if not selected
    if (!submitData.instrument_id && instruments.length > 0) {
      submitData.instrument_id = instruments[0].id
    }
    
    if (!submitData.raag_id) {
      alert('Please select a raag')
      return
    }
    if (!submitData.instrument_id) {
      alert('Please select an instrument')
      return
    }
    
    onCompose(submitData)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? parseFloat(value)
            : value,
    }))
  }

  return (
    <Card className="border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
      <h2 className="mb-6 text-xl font-bold">Composition Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Title (Optional)
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., My Love Song"
            className="border-primary/10 bg-background/50"
          />
        </div>

        {/* Lyrics */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Lyrics <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="lyrics"
            value={formData.lyrics}
            onChange={handleChange}
            placeholder="Paste or enter your Hindi lyrics here..."
            rows={4}
            className="border-primary/10 bg-background/50 resize-none"
          />
        </div>

        {/* Raag Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Raag <span className="text-red-500">*</span>
          </label>
          <select
            name="raag_id"
            value={formData.raag_id}
            onChange={handleChange}
            className="w-full rounded-lg border border-primary/10 bg-background/50 px-3 py-2 text-foreground"
          >
            <option value="">Select a Raag</option>
            {raags.map((raag) => (
              <option key={raag.id} value={raag.id}>
                {raag.name} - {raag.mood}
              </option>
            ))}
          </select>
        </div>

        {/* Category Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Category (Optional)
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-primary/10 bg-background/50 px-3 py-2 text-foreground"
          >
            <option value="">Select Category or Auto-Detect</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Instrument Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Instrument <span className="text-red-500">*</span>
          </label>
          <select
            name="instrument_id"
            value={formData.instrument_id}
            onChange={handleChange}
            className="w-full rounded-lg border border-primary/10 bg-background/50 px-3 py-2 text-foreground"
          >
            <option value="">Select an Instrument</option>
            {instruments.map((instrument) => (
              <option key={instrument.id} value={instrument.id}>
                {instrument.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tempo */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Tempo (BPM)
          </label>
          <Input
            type="number"
            name="tempo"
            value={formData.tempo}
            onChange={handleChange}
            min="60"
            max="200"
            className="border-primary/10 bg-background/50"
          />
        </div>

        {/* Auto-Detect Mood */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="auto_detect"
            name="auto_detect_mood"
            checked={formData.auto_detect_mood}
            onChange={handleChange}
            className="h-4 w-4 rounded border-primary/10 text-primary"
          />
          <label htmlFor="auto_detect" className="text-sm font-medium">
            Auto-Detect Mood from Lyrics
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Composing...
            </>
          ) : (
            'Compose Dhun'
          )}
        </Button>
      </form>
    </Card>
  )
}
