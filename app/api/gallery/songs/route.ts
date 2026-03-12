import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sample composed songs for fallback
const SAMPLE_SONGS = [
  {
    id: '1',
    title: 'Teri Khushboo',
    lyrics: 'Teri khushboo mein basa hai tera pyaar, duniya bhool jaun main saari',
    category: 'Romantic',
    mood: 'Romantic',
    instrument: 'Harmonium',
    raag_name: 'Yaman',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Spiritual Dawn',
    lyrics: 'Brahmn ki shakti, param tatva ki yatra, atma milan kare',
    category: 'Bhajan',
    mood: 'Devotional',
    instrument: 'Sarangi',
    raag_name: 'Bhairav',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Monsoon Dreams',
    lyrics: 'Barsat ke baad, sawan ki sunder ghata, dil ko bhigoe',
    category: 'Romantic',
    mood: 'Melancholic',
    instrument: 'Bansuri',
    raag_name: 'Kafi',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Happy Celebrations',
    lyrics: 'Khushi ki brishti barse, tyohaar manaye sab, mil kar gaaye',
    category: 'Patriotic',
    mood: 'Joyful',
    instrument: 'Harmonium',
    raag_name: 'Bhopali',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Heartbreak Melody',
    lyrics: 'Aaj tum nahi ho paas mere, dil toot gaya hai sara',
    category: 'Sad Song',
    mood: 'Sad',
    instrument: 'Sarangi',
    raag_name: 'Kafi',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { data: songs, error } = await supabase
      .from('composed_songs')
      .select(
        `
        *,
        raags (name, mood)
      `
      )
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && songs && songs.length > 0) {
      // Format the response
      const formattedSongs = songs.map((song) => ({
        id: song.id,
        title: song.title,
        lyrics: song.lyrics,
        category: song.category,
        mood: song.mood,
        instrument: song.instrument_ids?.[0] || 'Unknown',
        raag_name: song.raags?.name || 'Unknown',
        created_at: song.created_at,
      }))
      return NextResponse.json(formattedSongs)
    }

    // Fall back to sample data
    console.log('Using sample gallery songs as database is not available')
    return NextResponse.json(SAMPLE_SONGS)
  } catch (error) {
    console.error('Error in gallery API:', error)
    // Always return sample data as fallback
    return NextResponse.json(SAMPLE_SONGS)
  }
}
