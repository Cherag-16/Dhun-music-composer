import * as Tone from 'tone'

export interface SynthOptions {
  instrument: string
  tempo?: number
  volume?: number
}

export class IndianMusicSynthesizer {
  private synth: Tone.Synth | null = null
  private instrumentType: string
  private tempo: number
  private isPlaying: boolean = false

  constructor(options: SynthOptions) {
    this.instrumentType = options.instrument
    this.tempo = options.tempo || 120
    this.initializeSynth()
  }

  private initializeSynth() {
    // Create synthesizer based on instrument type
    switch (this.instrumentType) {
      case 'Harmonium':
        this.synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.3,
            release: 0.5,
          },
        })
        break

      case 'Sitar':
        this.synth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: {
            attack: 0.02,
            decay: 0.3,
            sustain: 0.1,
            release: 0.4,
          },
        })
        break

      case 'Sarangi':
        this.synth = new Tone.Synth({
          oscillator: { type: 'square' },
          envelope: {
            attack: 0.08,
            decay: 0.25,
            sustain: 0.2,
            release: 0.6,
          },
        })
        break

      case 'Bansuri':
        this.synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.03,
            decay: 0.15,
            sustain: 0.4,
            release: 0.3,
          },
        })
        break

      default:
        this.synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.3,
            release: 0.5,
          },
        })
    }

    // Connect to master output with reverb
    const reverb = new Tone.Reverb({
      decay: 2.5,
    }).toDestination()

    this.synth.connect(reverb)
  }

  /**
   * Play a single note with specified duration
   */
  async playNote(
    note: string,
    duration: string | number,
    time?: number
  ): Promise<void> {
    if (!this.synth) return

    const frequency = this.noteToFrequency(note)
    this.synth.frequency.value = frequency
    this.synth.triggerAttackRelease(duration, time)
  }

  /**
   * Play a sequence of notes (melody)
   */
  async playMelody(
    notes: Array<{ note: string; duration: number }>
  ): Promise<void> {
    if (!this.synth) return

    await Tone.start()
    this.isPlaying = true

    const beatDuration = (60 / this.tempo) * 4 // Quarter note duration in seconds

    let currentTime = Tone.now()

    for (const { note, duration } of notes) {
      const frequency = this.noteToFrequency(note)
      const noteDuration = duration * beatDuration

      this.synth.frequency.setValueAtTime(frequency, currentTime)
      this.synth.triggerAttack(currentTime)
      this.synth.triggerRelease(currentTime + noteDuration)

      currentTime += noteDuration
    }

    // Update status after playback
    setTimeout(() => {
      this.isPlaying = false
    }, (currentTime - Tone.now()) * 1000)
  }

  /**
   * Convert Indian classical note to frequency
   */
  private noteToFrequency(note: string): number {
    const frequencies: Record<string, number> = {
      S: 261.63,
      R: 293.66,
      g: 304.88,
      G: 329.63,
      M: 349.23,
      m: 369.99,
      P: 392.0,
      D: 440.0,
      n: 466.16,
      N: 493.88,
    }

    // Handle octave markers
    let baseNote = note
    let octaveMultiplier = 1

    if (note.includes("'")) {
      octaveMultiplier = 2
      baseNote = note.replace("'", '')
    } else if (note.includes(',')) {
      octaveMultiplier = 0.5
      baseNote = note.replace(',', '')
    }

    return (frequencies[baseNote] || 440) * octaveMultiplier
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (this.synth) {
      this.synth.triggerRelease()
    }
    this.isPlaying = false
  }

  /**
   * Check if audio is playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying
  }

  /**
   * Set tempo (BPM)
   */
  setTempo(tempo: number): void {
    this.tempo = tempo
  }

  /**
   * Dispose synthesizer and free resources
   */
  dispose(): void {
    if (this.synth) {
      this.synth.dispose()
      this.synth = null
    }
  }
}

/**
 * Generate audio buffer for a melody
 */
export async function generateAudioBuffer(
  notes: Array<{ note: string; duration: number }>,
  instrument: string = 'Harmonium',
  tempo: number = 120
): Promise<AudioBuffer> {
  const synth = new IndianMusicSynthesizer({
    instrument,
    tempo,
  })

  const audioContext = Tone.getContext().rawContext as AudioContext
  const sampleRate = audioContext.sampleRate
  const beatDuration = (60 / tempo) * 4

  let totalSamples = 0
  for (const { duration } of notes) {
    totalSamples += Math.floor(duration * beatDuration * sampleRate)
  }

  const audioBuffer = audioContext.createBuffer(1, totalSamples, sampleRate)
  const channelData = audioBuffer.getChannelData(0)

  // Simple synthesis (can be improved)
  let sampleIndex = 0
  for (const { note, duration } of notes) {
    const frequency = synth['noteToFrequency']?.(note) || 440
    const noteSamples = Math.floor(duration * beatDuration * sampleRate)

    for (let i = 0; i < noteSamples; i++) {
      const t = (sampleIndex + i) / sampleRate
      channelData[sampleIndex + i] = Math.sin(2 * Math.PI * frequency * t) * 0.3
    }

    sampleIndex += noteSamples
  }

  synth.dispose()
  return audioBuffer
}
