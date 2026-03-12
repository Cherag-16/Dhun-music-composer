import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SAMPLE_CATEGORIES = [
  { id: '1', name: 'Bhajan', description: 'Devotional songs' },
  { id: '2', name: 'Romantic', description: 'Love and romance themed songs' },
  { id: '3', name: 'Patriotic', description: 'Patriotic songs' },
  { id: '4', name: 'Gazal', description: 'Classical vocal music form' },
  { id: '5', name: 'Sad', description: 'Melancholic songs' },
  { id: '6', name: 'Devotional', description: 'Religious and spiritual songs' },
  { id: '7', name: 'Classical', description: 'Pure classical compositions' },
  {
    id: '8',
    name: 'Folk',
    description: 'Traditional folk songs and melodies',
  },
]

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from database
    const { data: dbCategories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (!error && dbCategories && dbCategories.length > 0) {
      return NextResponse.json(dbCategories)
    }

    // Fall back to sample data
    return NextResponse.json(SAMPLE_CATEGORIES)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(SAMPLE_CATEGORIES)
  }
}
