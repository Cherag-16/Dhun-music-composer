import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      training_song_id,
      generated_melody,
      original_melody,
    } = body

    if (!training_song_id || !generated_melody) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use AI to analyze similarity
    let similarityScore = 0
    let analysisNotes = ''

    try {
      const result = await generateText({
        model: 'groq/mixtral-8x7b-32768',
        prompt: `Analyze the similarity between these two musical melodies (note sequences):

Original melody: "${original_melody}"
Generated melody: "${generated_melody}"

Provide:
1. A similarity score from 0-100 (100 = perfect match)
2. Brief notes on the comparison

Return as JSON: {"score": 85, "notes": "..."}`,
      })

      const analysisData = JSON.parse(result.text)
      similarityScore = analysisData.score || 0
      analysisNotes = analysisData.notes || ''
    } catch (error) {
      console.error('Error analyzing similarity:', error)
      // Fallback: simple character matching
      const originalChars: string[] = original_melody?.split('').sort() ?? []
      const generatedChars: string[] = generated_melody?.split('').sort() ?? []
      const matches = originalChars.filter(
        (char, index) => char === generatedChars[index]
      ).length || 0
      similarityScore = Math.round(
        (matches / Math.max(originalChars.length || 1, generatedChars.length || 1)) * 100
      )
      analysisNotes = 'Basic character-based similarity analysis'
    }

    // Save comparison to database
    let comparisonId = null
    try {
      const { data, error: saveError } = await supabase
        .from('song_comparisons')
        .insert([
          {
            training_song_id,
            generated_melody,
            similarity_score: similarityScore,
            notes: analysisNotes,
          },
        ])
        .select()
        .single()

      if (!saveError && data) {
        comparisonId = data.id
      } else {
        console.error('Error saving comparison:', saveError)
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
    }

    return NextResponse.json({
      success: true,
      comparison: {
        id: comparisonId || `temp-${Date.now()}`,
        similarity_score: similarityScore,
        notes: analysisNotes,
      },
      saved_to_database: !!comparisonId,
    })
  } catch (error) {
    console.error('Error in comparison API:', error)
    return NextResponse.json(
      { error: 'Failed to compare melodies' },
      { status: 500 }
    )
  }
}
