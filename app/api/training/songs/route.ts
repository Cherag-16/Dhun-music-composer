import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sample training songs from popular Hindi movies
const SAMPLE_TRAINING_SONGS = [
  {
    id: '1',
    title: 'Lag Ja Gale',
    movie: 'Woh Kaun Thi (1967)',
    lyrics: 'Lag ja gale ki phir ye hasrat na ho, tum ko chhod kar main jag mein akela na rahu',
    original_raag: 'Yaman',
    mood: 'Romantic',
    category: 'Romantic',
    notes: 'Classic Bollywood romantic composition',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Mere Haathon Mein',
    movie: 'Mr. X in Bombay (1964)',
    lyrics: 'Mere haathon mein teri khushboo hai, tera chehra meri jaan hai',
    original_raag: 'Kafi',
    mood: 'Romantic',
    category: 'Romantic',
    notes: 'Timeless love composition',
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Aaj Phir Jeene Ki Tamanna Hai',
    movie: 'Chandni (1989)',
    lyrics: 'Aaj phir jeene ki tamanna hai, aaj phir marne ka khayal hai',
    original_raag: 'Yaman',
    mood: 'Romantic',
    category: 'Romantic',
    notes: 'Modern classic',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { data: songs, error } = await supabase
      .from('training_songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && songs && songs.length > 0) {
      return NextResponse.json(songs)
    }

    // Fall back to sample training data
    console.log('Using sample training songs as database is not available')
    return NextResponse.json(SAMPLE_TRAINING_SONGS)
  } catch (error) {
    console.error('Error in training songs API:', error)
    // Always return sample data as fallback
    return NextResponse.json(SAMPLE_TRAINING_SONGS)
  }
}
