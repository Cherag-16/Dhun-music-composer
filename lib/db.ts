import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function initializeDatabase() {
  try {
    // Check if tables exist, if not create them
    const { data: raags } = await supabase.from('raags').select('id').limit(1)

    if (!raags) {
      // Create tables
      await createTables()
      await seedData()
    }
  } catch (error) {
    console.error('Database initialization error:', error)
    // Tables might already exist, continue
  }
}

async function createTables() {
  // Create raags table
  await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS raags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        aroha TEXT NOT NULL,
        avaroha TEXT NOT NULL,
        vadi TEXT NOT NULL,
        samvadi TEXT,
        mood TEXT NOT NULL,
        time_period TEXT,
        season TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `,
  })

  // Create instruments table
  await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS instruments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        frequency_range TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `,
  })

  // Create categories table
  await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `,
  })

  // Create composed_songs table
  await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS composed_songs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        lyrics TEXT NOT NULL,
        raag_id UUID REFERENCES raags(id),
        category TEXT,
        mood TEXT,
        instrument_ids TEXT[],
        melody_notes TEXT NOT NULL,
        audio_data TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `,
  })

  // Create training_songs table
  await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS training_songs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        artist TEXT,
        movie TEXT,
        lyrics TEXT,
        original_melody TEXT,
        raag_id UUID REFERENCES raags(id),
        category TEXT,
        mood TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `,
  })

  // Create song_comparisons table
  await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS song_comparisons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        training_song_id UUID REFERENCES training_songs(id),
        generated_melody TEXT NOT NULL,
        similarity_score FLOAT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `,
  })
}

async function seedData() {
  // Seed raags
  const raags = [
    {
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
  ]

  for (const raag of raags) {
    await supabase.from('raags').insert([raag]).select()
  }

  // Seed instruments
  const instruments = [
    {
      name: 'Harmonium',
      type: 'Keyboard',
      frequency_range: '65-2100 Hz',
      description: 'Portable keyboard instrument used in classical Indian music',
    },
    {
      name: 'Sitar',
      type: 'String',
      frequency_range: '100-4000 Hz',
      description: 'Plucked string instrument of Indian classical music',
    },
    {
      name: 'Sarangi',
      type: 'String',
      frequency_range: '120-4000 Hz',
      description: 'Bowed string instrument with rich resonance',
    },
    {
      name: 'Bansuri',
      type: 'Wind',
      frequency_range: '200-2000 Hz',
      description: 'Traditional bamboo flute',
    },
    {
      name: 'Tabla',
      type: 'Percussion',
      frequency_range: '80-4000 Hz',
      description: 'Paired percussion drums',
    },
  ]

  for (const instrument of instruments) {
    await supabase.from('instruments').insert([instrument]).select()
  }

  // Seed categories
  const categories = [
    { name: 'Bhajan', description: 'Devotional songs' },
    { name: 'Romantic', description: 'Love and romance themed songs' },
    { name: 'Patriotic', description: 'Patriotic songs' },
    { name: 'Gazal', description: 'Classical vocal music form' },
    { name: 'Sad', description: 'Melancholic songs' },
  ]

  for (const category of categories) {
    await supabase.from('categories').insert([category]).select()
  }
}
