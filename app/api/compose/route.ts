import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { MelodyEngine, parseNotesString } from '@/lib/melody-engine'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sample raags data for fallback
const SAMPLE_RAAGS = [
  {
    id: '1',
    name: 'Bhairav',
    aroha: 'S R G M P D N S',
    avaroha: 'S N D P M G R S',
    vadi: 'D',
    samvadi: 'G',
    mood: 'Devotional',
  },
  {
    id: '2',
    name: 'Yaman',
    aroha: 'S G M P D N S',
    avaroha: 'S N D P M G S',
    vadi: 'G',
    samvadi: 'D',
    mood: 'Romantic',
  },
  {
    id: '3',
    name: 'Kafi',
    aroha: 'S R g M P D n S',
    avaroha: 'S n D P M g R S',
    vadi: 'P',
    samvadi: 'R',
    mood: 'Sad',
  },
  {
    id: '4',
    name: 'Bhopali',
    aroha: 'S R G P D S',
    avaroha: 'S D P G R S',
    vadi: 'P',
    samvadi: 'G',
    mood: 'Joyful',
  },
  {
    id: '5',
    name: 'Marwa',
    aroha: 'S R G M D N S',
    avaroha: 'S N D M G R S',
    vadi: 'M',
    samvadi: 'N',
    mood: 'Majestic',
  },
  {
    id: '6',
    name: 'Ahir Bhairav',
    aroha: 'S R g M P D n S',
    avaroha: 'S n D P M g R S',
    vadi: 'D',
    samvadi: 'G',
    mood: 'Peaceful',
  },
]

// Sample instruments data for fallback
const SAMPLE_INSTRUMENTS = [
  {
    id: '1',
    name: 'Harmonium',
    type: 'Keyboard',
  },
  {
    id: '2',
    name: 'Sitar',
    type: 'String',
  },
  {
    id: '3',
    name: 'Sarangi',
    type: 'String',
  },
  {
    id: '4',
    name: 'Bansuri',
    type: 'Wind',
  },
  {
    id: '5',
    name: 'Tabla',
    type: 'Percussion',
  },
  {
    id: '6',
    name: 'Veena',
    type: 'String',
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      lyrics,
      raag_id,
      category,
      instrument_id,
      tempo = 120,
      auto_detect_mood = true,
      title,
    } = body

    if (!lyrics || !raag_id || !instrument_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Try to fetch raag from database, fall back to sample data
    let raagData = null
    try {
      const { data, error } = await supabase
        .from('raags')
        .select('*')
        .eq('id', raag_id)
        .single()

      if (!error && data) {
        raagData = data
      }
    } catch (e) {
      console.error('Database error fetching raag:', e)
    }

    // Use sample raag data if database fetch failed
    if (!raagData) {
      raagData = SAMPLE_RAAGS.find((r) => r.id === raag_id)
    }

    if (!raagData) {
      return NextResponse.json(
        { error: 'Raag not found' },
        { status: 404 }
      )
    }

    // Try to fetch instrument from database, fall back to sample data
    let instrumentData = null
    try {
      const { data, error } = await supabase
        .from('instruments')
        .select('*')
        .eq('id', instrument_id)
        .single()

      if (!error && data) {
        instrumentData = data
      }
    } catch (e) {
      console.error('Database error fetching instrument:', e)
    }

    // Use sample instrument data if database fetch failed
    if (!instrumentData) {
      instrumentData = SAMPLE_INSTRUMENTS.find((i) => i.id === instrument_id)
    }

    if (!instrumentData) {
      return NextResponse.json(
        { error: 'Instrument not found' },
        { status: 404 }
      )
    }

    // Parse raag scales
    const aroha = parseNotesString(raagData.aroha)
    const avaroha = parseNotesString(raagData.avaroha)

    // Create melody engine
    const melodyEngine = new MelodyEngine({
      name: raagData.name,
      aroha,
      avaroha,
      vadi: raagData.vadi,
      samvadi: raagData.samvadi,
      mood: raagData.mood,
      time_period: raagData.time_period,
      season: raagData.season,
      description: raagData.description,
    })

    // Generate melody
    const melody = melodyEngine.generateMelody(lyrics, 16)

    // Detect mood if enabled
    // Simple keyword-based mood detection (no AI API needed)
    const detectMoodFromLyrics = (
      lyrics: string
    ): { mood: string; category: string } => {
      const lyricsLower = lyrics.toLowerCase()

      // Mood keywords mapping (Hindi and transliteration)
      const moodKeywords = {
        Romantic: [
          'pyaar',
          'mohabbat',
          'dil',
          'tera',
          'khushboo',
          'priya',
          'prem',
          'chhoo',
          'neend',
          'yaad',
          'taraf',
          'chaah',
        ],
        Sad: [
          'dukh',
          'takleef',
          'gham',
          'udaasi',
          'rona',
          'ror',
          'tuut',
          'tanha',
          'virah',
          'birah',
          'judai',
        ],
        Joyful: [
          'khushi',
          'ānand',
          'rangi',
          'raas',
          'nachna',
          'ghar',
          'mithai',
          'shaadi',
          'jashn',
        ],
        Devotional: [
          'bhagwan',
          'ishwar',
          'brahm',
          'dhyan',
          'puja',
          'archa',
          'satya',
          'shraddha',
          'naam',
          'prarthna',
        ],
        Patriotic: [
          'desh',
          'bharata',
          'vatan',
          'bandhan',
          'azadi',
          'shakti',
          'gurur',
          'itihas',
          'samaj',
        ],
        Gazal: [
          'raat',
          'chaand',
          'sitare',
          'khwahish',
          'hijr',
          'firak',
          'adaa',
          'nazar',
          'husn',
        ],
      }

      const moodScores: Record<string, number> = {}

      // Calculate scores for each mood
      for (const [mood, keywords] of Object.entries(moodKeywords)) {
        moodScores[mood] = 0
        for (const keyword of keywords) {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
          const matches = lyricsLower.match(regex)
          if (matches) {
            moodScores[mood] += matches.length
          }
        }
      }

      // Find the mood with highest score, default to raag mood
      let detectedMood = 'Peaceful'
      let detectedCategory = 'Bhajan'
      let maxScore = 0

      for (const [mood, score] of Object.entries(moodScores)) {
        if (score > maxScore) {
          maxScore = score
          detectedMood = mood
          detectedCategory = mood
        }
      }

      // If no mood detected from keywords, use raag mood
      if (maxScore === 0) {
        detectedMood = raagData.mood || 'Peaceful'
        detectedCategory = category || 'Bhajan'
      }

      return { mood: detectedMood, category: detectedCategory }
    }

    let detectedMood = raagData.mood
    let detectedCategory = category

    if (auto_detect_mood) {
      const { mood, category: cat } = detectMoodFromLyrics(lyrics)
      detectedMood = mood
      detectedCategory = cat
    }

    // Save composition to database (optional - composition works with or without DB)
    let composedSong = null
    try {
      const { data, error: saveError } = await supabase
        .from('composed_songs')
        .insert([
          {
            title: title || `Composition - ${new Date().toLocaleDateString()}`,
            lyrics,
            raag_id,
            category: detectedCategory || category,
            mood: detectedMood,
            instrument_ids: [instrumentData.name],
            melody_notes: JSON.stringify(melody),
          },
        ])
        .select()
        .single()

      if (!saveError && data) {
        composedSong = data
      }
      // Silently skip if database table doesn't exist (expected when DB not set up)
    } catch (dbError) {
      // Database unavailable or table doesn't exist - continue anyway
      // Composition still generated and returned successfully
    }

    // Generate a temporary ID if not saved to database
    const compositionId = composedSong?.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      id: compositionId,
      title: composedSong?.title || title || 'Untitled Composition',
      lyrics,
      raag_id,
      raag_name: raagData.name,
      mood: detectedMood,
      category: detectedCategory || category,
      instrument: instrumentData.name,
      melody: melody.map((n) => ({
        note: n.note,
        frequency: n.frequency,
        duration: n.duration,
        octave: n.octave,
      })),
      saved_to_database: !!composedSong,
    })
  } catch (error) {
    console.error('Error in compose endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to compose melody' },
      { status: 500 }
    )
  }
}
