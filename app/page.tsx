'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// Lucide React icons for the landing page
import { Music, Zap, Brain, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navigation from '@/components/navigation'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Music className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Classical Music Composition
            </span>
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
            Create Divine Dhuns with AI
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground/70 sm:text-xl">
            Transform your Hindi lyrics into beautiful classical melodies using ancient
            raag theory combined with modern AI. Compose music that resonates with Indian
            classical traditions.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/compose">
              <Button size="lg" className="w-full sm:w-auto">
                <Music className="mr-2 h-5 w-5" />
                Start Composing
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            Powerful Features
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-foreground/70">
            Everything you need to compose classical Indian music
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Waves,
                title: 'Raag-Based Composition',
                description: 'Generate melodies respecting Indian classical raag rules',
              },
              {
                icon: Brain,
                title: 'AI Mood Detection',
                description: 'Automatic mood and category detection from your lyrics',
              },
              {
                icon: Zap,
                title: 'Multiple Instruments',
                description: 'Play compositions with Harmonium, Sitar, Sarangi, and more',
              },
              {
                icon: Music,
                title: 'Learn from Masters',
                description: 'Train the system with popular Bollywood songs',
              },
            ].map((feature, i) => (
              <Card key={i} className="border-primary/10 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80">
                <feature.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-accent/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            How It Works
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: 1,
                title: 'Input Lyrics',
                description: 'Paste your Hindi song lyrics or enter your own poem',
              },
              {
                step: 2,
                title: 'Choose Raag',
                description: 'Select from traditional raags or let AI suggest the best fit',
              },
              {
                step: 3,
                title: 'Generate Melody',
                description: 'Our AI creates a unique melody respecting raag rules',
              },
              {
                step: 4,
                title: 'Play & Export',
                description: 'Play with various instruments or export your composition',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.description}</p>
                {i < 3 && (
                  <div className="absolute -right-4 top-6 hidden lg:block text-primary">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-8 text-center sm:p-12">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Ready to Compose?
          </h2>
          <p className="mb-8 text-foreground/70">
            Create your first dhun now. No experience needed—just pure creativity!
          </p>
          <Link href="/compose">
            <Button size="lg">
              <Music className="mr-2 h-5 w-5" />
              Start Composing Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-foreground/60">
          <p>
            Dhun AI © 2024 | Powered by AI & Indian Classical Music Theory
          </p>
        </div>
      </footer>
    </main>
  )
}
