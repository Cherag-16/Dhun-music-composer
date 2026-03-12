import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SAMPLE_INSTRUMENTS = [
  {
    id: '1',
    name: 'Harmonium',
    type: 'Keyboard',
    frequency_range: '65-2100 Hz',
    description: 'Portable keyboard instrument used in classical Indian music',
  },
  {
    id: '2',
    name: 'Sitar',
    type: 'String',
    frequency_range: '100-4000 Hz',
    description: 'Plucked string instrument of Indian classical music',
  },
  {
    id: '3',
    name: 'Sarangi',
    type: 'String',
    frequency_range: '120-4000 Hz',
    description: 'Bowed string instrument with rich resonance',
  },
  {
    id: '4',
    name: 'Bansuri',
    type: 'Wind',
    frequency_range: '200-2000 Hz',
    description: 'Traditional bamboo flute',
  },
  {
    id: '5',
    name: 'Tabla',
    type: 'Percussion',
    frequency_range: '80-4000 Hz',
    description: 'Paired percussion drums',
  },
  {
    id: '6',
    name: 'Veena',
    type: 'String',
    frequency_range: '100-3500 Hz',
    description: 'Ancient plucked string instrument',
  },
]

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from database
    const { data: dbInstruments, error } = await supabase
      .from('instruments')
      .select('*')
      .order('name')

    if (!error && dbInstruments && dbInstruments.length > 0) {
      return NextResponse.json(dbInstruments)
    }

    // Fall back to sample data
    return NextResponse.json(SAMPLE_INSTRUMENTS)
  } catch (error) {
    console.error('Error fetching instruments:', error)
    return NextResponse.json(SAMPLE_INSTRUMENTS)
  }
}
