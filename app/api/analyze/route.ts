import { NextRequest, NextResponse } from 'next/server'

// Keyword-based analysis (no external APIs needed)
function analyzelyrics(lyrics: string) {
  const lyricsLower = lyrics.toLowerCase()

  // Mood and category keywords
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
    Peaceful: [
      'shanti',
      'sukh',
      'anand',
      'shaanti',
      'santaan',
      'sukoon',
      'prasant',
      'santosh',
      'swarg',
    ],
  }

  const raagMapping = {
    Romantic: ['Yaman', 'Kafi', 'Jor'],
    Sad: ['Kafi', 'Sarang', 'Ahir Bhairav'],
    Joyful: ['Bhopali', 'Bhairav', 'Patdeep'],
    Devotional: ['Bhairav', 'Bhatiyali', 'Ahir Bhairav'],
    Patriotic: ['Marwa', 'Bhairav', 'Yaman'],
    Peaceful: ['Ahir Bhairav', 'Kafi', 'Sarang'],
  }

  const instrumentMapping = {
    Romantic: ['Sarangi', 'Bansuri', 'Sitar'],
    Sad: ['Sarangi', 'Veena', 'Bansuri'],
    Joyful: ['Harmonium', 'Sitar', 'Tabla'],
    Devotional: ['Harmonium', 'Bansuri', 'Veena'],
    Patriotic: ['Sitar', 'Sarod', 'Tabla'],
    Peaceful: ['Bansuri', 'Veena', 'Sarangi'],
  }

  // Score each mood
  const moodScores: Record<string, number> = {}
  let detectedMood = 'Peaceful'
  let maxScore = 0

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    moodScores[mood] = 0
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = lyricsLower.match(regex)
      if (matches) {
        moodScores[mood] += matches.length
      }
    }

    if (moodScores[mood] > maxScore) {
      maxScore = moodScores[mood]
      detectedMood = mood
    }
  }

  // If no keywords matched, default to Peaceful
  if (maxScore === 0) {
    detectedMood = 'Peaceful'
  }

  return {
    mood: detectedMood,
    raag: raagMapping[detectedMood as keyof typeof raagMapping]?.[0] || 'Bhairav',
    category: detectedMood,
    instruments: instrumentMapping[detectedMood as keyof typeof instrumentMapping] || [
      'Harmonium',
    ],
    confidence: Math.min(maxScore / 5, 1.0), // Normalize confidence score
    analysis: `Detected ${detectedMood} mood from lyrics keywords. Suggested raag: ${raagMapping[detectedMood as keyof typeof raagMapping]?.[0] || 'Bhairav'}`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lyrics } = body

    if (!lyrics) {
      return NextResponse.json({ error: 'Lyrics are required' }, { status: 400 })
    }

    const analysis = analyzelyrics(lyrics)
    return NextResponse.json(analysis)
  } catch (error) {
    // Return safe defaults on error
    return NextResponse.json(
      {
        mood: 'Peaceful',
        raag: 'Bhairav',
        category: 'Classical',
        instruments: ['Harmonium'],
        confidence: 0.5,
        analysis: 'Using default settings',
      },
      { status: 200 }
    )
  }
}
