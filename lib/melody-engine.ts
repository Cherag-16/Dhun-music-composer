// Musical note frequencies (in Hz) for Indian classical music
const NOTE_FREQUENCIES: Record<string, number> = {
  S: 261.63, // Shadaj (Do)
  R: 293.66, // Rishabh (Re)
  g: 304.88, // Komal Gandhar (Re#)
  G: 329.63, // Gandhar (Mi)
  M: 349.23, // Madhyam (Fa)
  m: 369.99, // Tivra Madhyam (Fa#)
  P: 392.0, // Pancham (Sol)
  D: 440.0, // Dhaivat (La)
  n: 466.16, // Komal Nishad (La#)
  N: 493.88, // Nishad (Si)
}

export interface Raag {
  name: string
  aroha: string[]
  avaroha: string[]
  vadi: string
  samvadi: string
  mood: string
  time_period: string
  season: string
  description: string
}

export interface MelodyNote {
  note: string
  frequency: number
  duration: number // in beats
  octave: number
}

export class MelodyEngine {
  private raag: Raag
  private selectedNotes: string[]
  private vadi: string
  private samvadi: string

  constructor(raag: Raag) {
    this.raag = raag
    this.selectedNotes = [...raag.aroha]
    this.vadi = raag.vadi
    this.samvadi = raag.samvadi
  }

  /**
   * Generate a melody based on raag rules and lyrics
   */
  generateMelody(lyrics: string, length: number = 16): MelodyNote[] {
    const melody: MelodyNote[] = []
    const words = lyrics.split(' ')
    const notesPerWord = Math.ceil(length / words.length)

    for (let i = 0; i < length; i++) {
      // Get next note respecting raag rules
      const note = this.getNextNote(i, words)
      const frequency = this.getNoteFrequency(note)
      const duration = this.getDurationForNote(note)
      const octave = this.getOctaveForNote(note, i)

      melody.push({
        note,
        frequency,
        duration,
        octave,
      })
    }

    return melody
  }

  /**
   * Get next note based on raag and position
   */
  private getNextNote(position: number, words: string[]): string {
    const wordIndex = Math.floor((position / 16) * words.length)
    const wordLength = words[wordIndex]?.length || 1
    const charIndex = position % wordLength

    // Weight towards vadi (most important note) and samvadi
    if (position % 8 === 0) return this.vadi
    if (position % 4 === 0) return this.samvadi

    // Use aroha notes for ascending phrases, avaroha for descending
    const useAroha = position % 2 === 0
    const notes = useAroha ? this.raag.aroha : this.raag.avaroha

    // Select based on character code for pseudo-randomness
    const charCode = charIndex % notes.length
    return notes[charCode]
  }

  /**
   * Get frequency for a note with octave adjustment
   */
  private getNoteFrequency(note: string, octave: number = 1): number {
    const baseFreq = NOTE_FREQUENCIES[note] || 440
    return baseFreq * Math.pow(2, octave - 1)
  }

  /**
   * Determine duration for a note based on its importance
   */
  private getDurationForNote(note: string): number {
    if (note === this.vadi) return 2 // Vadi gets more emphasis
    if (note === this.samvadi) return 1.5 // Samvadi gets moderate emphasis
    return 1 // Regular notes
  }

  /**
   * Get appropriate octave for a note
   */
  private getOctaveForNote(note: string, position: number): number {
    if (position % 8 < 4) return 1 // Lower octave
    if (position % 8 < 6) return 2 // Middle octave
    return 2 // Higher octave
  }

  /**
   * Check if note is valid in the raag
   */
  isValidNote(note: string): boolean {
    return this.raag.aroha.includes(note) || this.raag.avaroha.includes(note)
  }

  /**
   * Get scale notes for the raag
   */
  getScale(): string[] {
    return this.raag.aroha
  }

  /**
   * Get raag mood
   */
  getMood(): string {
    return this.raag.mood
  }

  /**
   * Get raag name
   */
  getName(): string {
    return this.raag.name
  }
}

/**
 * Convert notes to MIDI note numbers for synthesis
 */
export function noteToMidiNumber(note: string, octave: number = 1): number {
  const noteToSemitone: Record<string, number> = {
    S: 0,
    R: 2,
    g: 3,
    G: 4,
    M: 5,
    m: 6,
    P: 7,
    D: 9,
    n: 10,
    N: 11,
  }

  const semitone = noteToSemitone[note] || 0
  const baseC = 12 // Middle C
  return baseC + octave * 12 + semitone
}

/**
 * Parse aroha/avaroha strings into note arrays
 */
export function parseNotesString(notesStr: string): string[] {
  return notesStr.split(' ').filter((n) => n.length > 0)
}

/**
 * Generate variations of a melody for learning
 */
export function generateMelodyVariations(
  melody: MelodyNote[],
  count: number = 3
): MelodyNote[][] {
  const variations: MelodyNote[][] = []

  for (let v = 0; v < count; v++) {
    const variation = melody.map((note, index) => ({
      ...note,
      // Slight frequency variations for musical expression
      frequency:
        note.frequency *
        (1 + (Math.sin(index + v) * 0.02)), // ±2% variation
      // Duration variations
      duration: note.duration * (0.8 + Math.random() * 0.4), // 80-120% of original
    }))
    variations.push(variation)
  }

  return variations
}
