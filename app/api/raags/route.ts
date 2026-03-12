import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sample raags data - this will be fetched from database
const SAMPLE_RAAGS = [
  {
    id: '1',
    name: 'Bhairav',
    aroha: 'S R G M P D N S',
    avaroha: 'S N D P M G R S',
    vadi: 'D',
    samvadi: 'G',
    mood: 'Devotional',
    time_period: 'Morning (Early)',
    season: 'Spring',
    description: 'Serious, majestic, spiritual',
  },
  {
    id: '2',
    name: 'Yaman',
    aroha: 'S G M P D N S',
    avaroha: 'S N D P M G S',
    vadi: 'G',
    samvadi: 'D',
    mood: 'Romantic',
    time_period: 'Evening',
    season: 'All',
    description: 'Sweet, romantic, peaceful',
  },
  {
    id: '3',
    name: 'Kafi',
    aroha: 'S R g M P D n S',
    avaroha: 'S n D P M g R S',
    vadi: 'P',
    samvadi: 'R',
    mood: 'Sad',
    time_period: 'Afternoon',
    season: 'Monsoon',
    description: 'Melancholic, soulful, introspective',
  },
  {
    id: '4',
    name: 'Bhopali',
    aroha: 'S R G P D S',
    avaroha: 'S D P G R S',
    vadi: 'P',
    samvadi: 'G',
    mood: 'Joyful',
    time_period: 'Anytime',
    season: 'All',
    description: 'Happy, simple, folk-like',
  },
  {
    id: '5',
    name: 'Marwa',
    aroha: 'S R G M D N S',
    avaroha: 'S N D M G R S',
    vadi: 'M',
    samvadi: 'N',
    mood: 'Majestic',
    time_period: 'Evening',
    season: 'Summer',
    description: 'Grandeur, brilliance, heroic',
  },
  {
    id: '6',
    name: 'Ahir Bhairav',
    aroha: 'S R g M P D n S',
    avaroha: 'S n D P M g R S',
    vadi: 'D',
    samvadi: 'G',
    mood: 'Peaceful',
    time_period: 'Morning',
    season: 'Winter',
    description: 'Calm, soothing, meditative',
  },
]

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from database
    const { data: dbRaags, error } = await supabase
      .from('raags')
      .select('*')
      .order('name')

    if (!error && dbRaags && dbRaags.length > 0) {
      return NextResponse.json(dbRaags)
    }

    // Fall back to sample data if database is empty
    return NextResponse.json(SAMPLE_RAAGS)
  } catch (error) {
    console.error('Error fetching raags:', error)
    // Always return sample data as fallback
    return NextResponse.json(SAMPLE_RAAGS)
  }
}
