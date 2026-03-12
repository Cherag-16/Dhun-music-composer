-- Create ENUM types
CREATE TYPE IF NOT EXISTS mood_type AS ENUM ('bhajan', 'romantic', 'patriotic', 'gazal', 'sad', 'devotional', 'classical', 'folk');

-- Raags table - stores Indian classical music raag definitions
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

-- Mood Keywords - for mood detection from lyrics
CREATE TABLE IF NOT EXISTS mood_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword VARCHAR(255) NOT NULL,
  mood mood_type NOT NULL,
  weight FLOAT DEFAULT 1.0,
  language VARCHAR(20) DEFAULT 'hindi',
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(keyword, mood, language)
);

-- Composed Songs table
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

-- Training Data table
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

-- Song Comparisons table
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
  emphasis_level INT CHECK (emphasis_level >= 1 AND emphasis_level <= 5),
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
CREATE INDEX IF NOT EXISTS idx_composed_songs_raag ON composed_songs(selected_raag_id);
CREATE INDEX IF NOT EXISTS idx_composed_songs_mood ON composed_songs(detected_mood);
CREATE INDEX IF NOT EXISTS idx_training_songs_mood ON training_songs(mood);
CREATE INDEX IF NOT EXISTS idx_training_songs_raag ON training_songs(raag_id);
CREATE INDEX IF NOT EXISTS idx_mood_keywords_mood ON mood_keywords(mood);
CREATE INDEX IF NOT EXISTS idx_song_comparisons_training ON song_comparisons(training_song_id);

-- Insert initial raags
INSERT INTO raags (name, description, mood, category, aroha, avaroha, vadi, samvadi, time_period) VALUES
('Bhairav', 'Ancient and sacred raag, often performed in temples', 'devotional', 'classical', 'sa re ma pa dha ni sa', 'sa ni dha pa ma ga re sa', 'ma', 'sa', 'early morning'),
('Yaman', 'Sweet and pleasant raag, brings joy and celebration', 'romantic', 'classical', 'sa ga ma dha ni sa', 'sa ni dha ma ga re sa', 'dha', 'sa', 'evening'),
('Bhairavī', 'Serious and contemplative raag with devotional essence', 'devotional', 'bhajan', 'sa re ga ma pa dha ni sa', 'sa ni dha pa ma ga re sa', 'ga', 'sa', 'morning'),
('Jog', 'Deep and meditative raag, expresses sorrow and longing', 'sad', 'classical', 'sa dha ni sa ga ma pa dha ni sa', 'sa ni dha pa ma ga re sa', 'pa', 'sa', 'evening'),
('Kafi', 'Soft and gentle raag, romantic and devotional feelings', 'romantic', 'bhajan', 'sa re ga ma pa dha sa', 'sa ni dha pa ma ga re sa', 'dha', 'sa', 'afternoon'),
('Marwa', 'Energetic and powerful raag, brings patriotic spirit', 'patriotic', 'classical', 'sa ma pa dha ni sa', 'sa ni dha pa ma ga sa', 'dha', 'ma', 'evening'),
('Sarang', 'Classical raag with complex melodic movement', 'classical', 'classical', 'sa ga ma pa dha ni sa', 'sa ni dha pa ma ga sa', 'pa', 'sa', 'afternoon')
ON CONFLICT (name) DO NOTHING;

-- Insert initial instruments
INSERT INTO instruments (name, description, category) VALUES
('Harmonium', 'Traditional Indian keyboard instrument, widely used in classical music', 'keyboard'),
('Violin', 'String instrument adapted for Indian classical music', 'string'),
('Sitar', 'Plucked string instrument with distinctive resonance', 'string'),
('Sarangi', 'Bowed string instrument with rich, soulful tone', 'string'),
('Bansuri', 'Traditional bamboo flute, associated with Lord Krishna', 'wind'),
('Shehnai', 'Double-reed wind instrument with bright, penetrating tone', 'wind'),
('Tabla', 'Pair of hand drums providing rhythm', 'percussion'),
('Mridangam', 'Double-headed drum with complex tonal variations', 'percussion'),
('Flute', 'Western flute adapted for Indian classical music', 'wind')
ON CONFLICT (name) DO NOTHING;

-- Insert initial mood keywords
INSERT INTO mood_keywords (keyword, mood, weight, language) VALUES
('प्यार', 'romantic', 1.5, 'hindi'),
('प्रेम', 'romantic', 1.5, 'hindi'),
('दिल', 'romantic', 1.0, 'hindi'),
('खुशी', 'romantic', 1.0, 'hindi'),
('उदास', 'sad', 1.5, 'hindi'),
('दुःख', 'sad', 1.5, 'hindi'),
('रो', 'sad', 1.2, 'hindi'),
('भगवान', 'devotional', 1.5, 'hindi'),
('माता', 'devotional', 1.5, 'hindi'),
('देश', 'patriotic', 1.5, 'hindi'),
('राष्ट्र', 'patriotic', 1.5, 'hindi'),
('भारत', 'patriotic', 1.2, 'hindi'),
('स्वतंत्र', 'patriotic', 1.5, 'hindi'),
('इश्क', 'gazal', 1.5, 'hindi'),
('शायरी', 'gazal', 1.0, 'hindi')
ON CONFLICT (keyword, mood, language) DO NOTHING;
