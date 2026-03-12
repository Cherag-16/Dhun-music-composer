import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      artist,
      movie,
      lyrics,
      original_melody,
      raag,
      category,
    } = body

    if (!title || !lyrics) {
      return NextResponse.json(
        { error: 'Title and lyrics are required' },
        { status: 400 }
      )
    }

    // Get raag ID if provided
    let raagId = null
    if (raag) {
      const { data: raagData } = await supabase
        .from('raags')
        .select('id')
        .eq('name', raag)
        .single()

      if (raagData) {
        raagId = raagData.id
      }
    }

    // Insert training song
    let trainingSong = null
    try {
      const { data, error } = await supabase
        .from('training_songs')
        .insert([
          {
            title,
            artist: artist || null,
            movie: movie || null,
            lyrics,
            original_melody: original_melody || null,
            raag_id: raagId,
            category: category || null,
          },
        ])
        .select()
        .single()

      if (!error && data) {
        trainingSong = data
      } else {
        console.error('Error saving training song:', error)
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
    }

    // Return success even if database save fails
    return NextResponse.json({
      success: true,
      trainingSong: trainingSong || {
        id: `temp-${Date.now()}`,
        title,
        artist: artist || null,
        movie: movie || null,
        lyrics,
        original_melody: original_melody || null,
        raag_id: raagId,
        category: category || null,
        created_at: new Date().toISOString(),
      },
      saved_to_database: !!trainingSong,
    })
  } catch (error) {
    console.error('Error in training API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
