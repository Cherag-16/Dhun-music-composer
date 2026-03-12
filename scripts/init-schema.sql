-- Create ENUM types
CREATE TYPE IF NOT EXISTS mood_type AS ENUM ('bhajan', 'romantic', 'patriotic', 'gazal', 'sad', 'devotional', 'classical', 'folk');

-- Raags table
CREATE TABLE IF NOT EXISTS raags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  mood mood_type NOT NULL,
  category VARCHAR(100) NOT NULL,
  aroha TEXT NOT NULL,
  avaroha TEXT NOT NULL,
  vadi VARCHAR(5),
  samvadi VARCHAR(5),
  time_period VARCHAR(100),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Instruments table
CREATE TABLE IF NOT EXISTS instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),
  min_note VARCHAR(5) DEFAULT 'sa',
  max_note VARCHAR(5) DEFAULT 'ni',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Mood Keywords
CREATE TABLE IF NOT EXISTS mood_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword VARCHAR(255) NOT NULL,
  mood mood_type NOT NULL,
  weight FLOAT DEFAULT 1.0,
  language VARCHAR(20) DEFAULT 'hindi',
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(keyword, mood, language)
);

-- Composed Songs
CREATE TABLE IF NOT EXISTS composed_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title VARCHAR(255) NOT NULL,
  lyrics TEXT NOT NULL,
  detected_mood mood_type,
  selected_raag_id UUID REFERENCES raags(id) ON DELETE SET NULL,
  selected_instrument_id UUID REFERENCES instruments(id) ON DELETE SET NULL,
  melody_sequence TEXT,
  audio_data TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Training Songs
CREATE TABLE IF NOT EXISTS training_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  movie VARCHAR(255),
  lyrics TEXT NOT NULL,
  original_dhun_sequence TEXT,
  raag_id UUID REFERENCES raags(id) ON DELETE SET NULL,
  instrument_id UUID REFERENCES instruments(id) ON DELETE SET NULL,
  mood mood_type,
  audio_url TEXT,
  popularity_score FLOAT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Song Comparisons
CREATE TABLE IF NOT EXISTS song_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_song_id UUID REFERENCES training_songs(id) ON DELETE CASCADE,
  generated_composition_id UUID REFERENCES composed_songs(id) ON DELETE CASCADE,
  similarity_score FLOAT,
  user_rating INT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Raag Performance Notes
CREATE TABLE IF NOT EXISTS raag_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raag_id UUID NOT NULL REFERENCES raags(id) ON DELETE CASCADE,
  note VARCHAR(5) NOT NULL,
  emphasis_level INT,
  common_in_aroha BOOLEAN DEFAULT true,
  common_in_avaroha BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(raag_id, note)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_raags_mood ON raags(mood);
CREATE INDEX IF NOT EXISTS idx_raags_category ON raags(category);
CREATE INDEX IF NOT EXISTS idx_instruments_category ON instruments(category);
CREATE INDEX IF NOT EXISTS idx_composed_songs_user ON composed_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_keywords_mood ON mood_keywords(mood);
