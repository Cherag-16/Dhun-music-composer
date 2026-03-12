'use client'

import Link from 'next/link'
import { Music, Code, Brain, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navigation from '@/components/navigation'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />

      {/* Header */}
      <section className="border-b border-primary/10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">About Dhun AI</h1>
          <p className="text-lg text-foreground/70">
            Creating beautiful classical melodies using ancient wisdom and modern AI
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="border-primary/10 space-y-6 bg-card/50 p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold">Our Vision</h2>
            <p className="text-foreground/70 leading-relaxed">
              Dhun AI bridges the gap between centuries-old Indian classical music theory
              and cutting-edge artificial intelligence. We believe that music composition
              should be accessible to everyone, regardless of their musical training.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              By leveraging the mathematical precision of raag theory combined with AI,
              we enable anyone to compose authentic, emotionally resonant classical melodies
              from simple lyrics.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-accent/5 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold">How It Works</h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Analyze Your Lyrics',
                description:
                  'Our AI analyzes your Hindi lyrics to understand the emotional context, mood, and theme. This analysis guides the entire composition process.',
                icon: Brain,
              },
              {
                step: 2,
                title: 'Select the Perfect Raag',
                description:
                  'Based on the mood and category, we help you choose the ideal raag. Each raag has specific notes (aroha and avaroha) that create its unique character.',
                icon: Music,
              },
              {
                step: 3,
                title: 'Generate Melody',
                description:
                  'Our melody engine combines raag rules with AI suggestions to create a melodic sequence that respects classical traditions while being unique.',
                icon: Code,
              },
              {
                step: 4,
                title: 'Synthesize Sound',
                description:
                  'Using Web Audio API, we synthesize realistic instrument sounds. Each instrument has unique characteristics that match traditional Indian instruments.',
                icon: Globe,
              },
            ].map((item, i) => (
              <Card key={i} className="border-primary/10 bg-white/50 p-6 backdrop-blur-sm">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      <span className="text-primary">{item.step}.</span> {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Raag Education */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold">Understanding Raags</h2>

          <Card className="border-primary/10 space-y-6 bg-card/50 p-8 backdrop-blur-sm">
            <p className="text-foreground/70 leading-relaxed">
              A raag is a melodic framework used in Indian classical music. It defines:
            </p>

            <div className="space-y-4">
              {[
                {
                  term: 'Aroha',
                  definition:
                    'The ascending sequence of notes (S R G M P D N S). Like climbing a musical ladder.',
                },
                {
                  term: 'Avaroha',
                  definition:
                    'The descending sequence of notes. May differ from aroha, creating unique character.',
                },
                {
                  term: 'Vadi',
                  definition:
                    'The most important note of the raag. It receives emphasis and defines the character.',
                },
                {
                  term: 'Samvadi',
                  definition:
                    'The secondary important note, complementing the vadi in creating the raag\'s identity.',
                },
                {
                  term: 'Time & Season',
                  definition:
                    'Each raag is associated with specific times of day and seasons for optimal resonance.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-primary/10 bg-primary/5 p-4"
                >
                  <h4 className="font-semibold text-primary">{item.term}</h4>
                  <p className="mt-1 text-sm text-foreground/70">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-foreground/60 italic">
              Learn more about raags on the <Link href="/raags" className="underline">
                Raags page
              </Link>.
            </p>
          </Card>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-accent/5 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold">Technology Stack</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                category: 'Frontend',
                items: ['Next.js 16', 'React 19', 'TailwindCSS', 'shadcn/ui'],
              },
              {
                category: 'Backend',
                items: ['Next.js API Routes', 'Supabase PostgreSQL'],
              },
              {
                category: 'AI & Music',
                items: [
                  'Groq LLM',
                  'Tone.js',
                  'Web Audio API',
                  'Raag Theory',
                ],
              },
              {
                category: 'Infrastructure',
                items: [
                  'Vercel Deployment',
                  'Supabase Database',
                  'Edge Functions',
                ],
              },
            ].map((stack, i) => (
              <Card key={i} className="border-primary/10 bg-white/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 font-semibold text-primary">{stack.category}</h3>
                <ul className="space-y-2">
                  {stack.items.map((item, j) => (
                    <li key={j} className="text-sm text-foreground/70">
                      • {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold">Roadmap</h2>

          <div className="space-y-6">
            {[
              {
                phase: 'Phase 1 (Current)',
                description: 'Single instrument composition with raag-based generation',
                status: 'Completed',
                features: [
                  'AI mood detection',
                  'Raag-based melody generation',
                  'Real-time audio playback',
                  'Composition export',
                ],
              },
              {
                phase: 'Phase 2',
                description: 'Multi-instrument compositions with harmony',
                status: 'In Planning',
                features: [
                  'Multiple instruments with harmony',
                  'Advanced raag detection',
                  'MIDI export',
                  'User accounts',
                ],
              },
              {
                phase: 'Phase 3',
                description: 'ML learning from popular songs',
                status: 'Future',
                features: [
                  'Training system integration',
                  'Song comparison algorithms',
                  'Continuous model improvement',
                  'Bollywood song database',
                ],
              },
            ].map((item, i) => (
              <Card key={i} className="border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold">{item.phase}</h3>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      item.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'In Planning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mb-3 text-sm text-foreground/70">{item.description}</p>
                <ul className="space-y-1 text-sm">
                  {item.features.map((feature, j) => (
                    <li key={j} className="text-foreground/60">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-primary/10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to Create?</h2>
          <p className="mb-8 text-foreground/70">
            Start composing your first dhun today. No musical experience needed!
          </p>
          <Link href="/compose">
            <Button size="lg">
              <Music className="mr-2 h-5 w-5" />
              Start Composing
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-foreground/60">
          <p>
            Dhun AI © 2024 | Preserving Indian Classical Music Through Technology
          </p>
          <p className="mt-2">
            <Link href="/" className="hover:text-foreground">Home</Link>
            {' '} • {' '}
            <Link href="/compose" className="hover:text-foreground">Compose</Link>
            {' '} • {' '}
            <Link href="/raags" className="hover:text-foreground">Raags</Link>
            {' '} • {' '}
            <Link href="/training" className="hover:text-foreground">Training</Link>
            {' '} • {' '}
            <Link href="/gallery" className="hover:text-foreground">Gallery</Link>
          </p>
        </div>
      </footer>
    </main>
  )
}
