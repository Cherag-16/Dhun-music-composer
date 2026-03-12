# Dhun AI - Indian Classical Music Composition System

A sophisticated AI-powered application for composing classical Indian music (dhuns) from Hindi lyrics using raag theory and modern machine learning.

## 🎵 Features

### Phase 1 (Current MVP)
- **AI-Powered Dhun Generation**: Create melodies from Hindi lyrics respecting classical raag rules
- **Raag-Based Composition**: Supports multiple raags (Bhairav, Yaman, Kafi, Bhopali, Marwa, Ahir Bhairav)
- **Mood Detection**: Automatic mood and category detection from lyrics using Groq AI
- **Single Instrument Synthesis**: Play compositions with realistic instrument simulation (Harmonium, Sitar, Sarangi, Bansuri)
- **Real-time Audio Playback**: Web Audio API synthesis with Tone.js
- **Composition Export**: Download generated compositions as WAV files
- **Responsive Design**: Fully mobile-responsive interface

### Phase 2 (Roadmap)
- Multi-instrument compositions with harmony generation
- Real-time collaboration features
- Advanced raag recommendation engine

### Phase 3 (Roadmap)
- Training system with popular Bollywood songs
- Comparison algorithms for melody similarity analysis
- ML model training for learning from popular compositions

## 🏗️ Architecture

### Frontend
- **Next.js 16**: React framework with App Router
- **TailwindCSS v4**: Responsive utility-first CSS
- **shadcn/ui**: Pre-built accessible components
- **Tone.js**: Web Audio API wrapper for music synthesis
- **Lucide React**: Icon library

### Backend
- **Next.js API Routes**: Serverless backend
- **Groq AI**: Fast LLM inference for mood/category detection
- **Supabase**: PostgreSQL database for data persistence

### AI & Music
- **Melody Engine**: Raag-based note generation with mathematical rules
- **Audio Synthesis**: Oscillator-based synthesis with envelopes and filters
- **Mood Analysis**: LLM-based analysis of lyrics for emotion detection

## 🗄️ Database Schema

### Tables
1. **raags**: Indian classical raags with aroha/avaroha patterns
2. **instruments**: Musical instruments with frequency ranges
3. **categories**: Song categories (Bhajan, Romantic, etc.)
4. **composed_songs**: Generated compositions
5. **training_songs**: Popular songs for system learning
6. **song_comparisons**: AI analysis of generated vs. popular melodies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account
- Groq API key

### Installation

1. Clone and install dependencies:
```bash
npm install
# or
pnpm install
```

2. Set up environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 📖 Usage Guide

### Creating a Composition

1. **Go to Compose Page**: Click "Start Composing" on the home page
2. **Enter Lyrics**: Paste or type your Hindi lyrics
3. **Select Raag**: Choose a raag that matches your mood, or let AI suggest one
4. **Choose Instrument**: Pick an instrument for playback
5. **Generate**: Click "Compose Dhun" to create the melody
6. **Preview**: See the melody visualization and play it back
7. **Export**: Download the composition as a WAV file

### Understanding Raags

Visit the **Raags** page to:
- Explore all available raags
- Learn their aroha (ascending) and avaroha (descending) note patterns
- Understand their mood and time associations
- View their vadi (primary) and samvadi (secondary) notes

### Training the System

Use the **Training** page to:
1. Add popular Bollywood songs with their original melodies
2. Help the AI learn composition patterns from successful songs
3. View the growing training dataset

## 🎼 Technical Details

### Raag Theory Implementation

Each raag is defined by:
- **Aroha**: Notes in ascending order (S R G M P D N S)
- **Avaroha**: Notes in descending order
- **Vadi**: Most important note (receives emphasis)
- **Samvadi**: Secondary important note
- **Mood**: Emotional character (Devotional, Romantic, Sad, etc.)
- **Time**: Best time of day to perform
- **Season**: Associated season

### Melody Generation Algorithm

1. Parse raag rules (aroha/avaroha patterns)
2. Analyze lyrics for emotion and context
3. Generate note sequence respecting raag constraints
4. Apply vadi/samvadi emphasis rules
5. Create duration patterns based on word structure
6. Synthesize audio with appropriate instrument characteristics

### Audio Synthesis

- **Oscillator Types**: Sine (Harmonium, Bansuri), Triangle (Sitar), Square (Sarangi)
- **Envelopes**: Attack, Decay, Sustain, Release (ADSR)
- **Effects**: Low-pass filter, Reverb for spatial depth
- **Rendering**: Web Audio API for real-time playback

## 🔄 API Endpoints

### Composition
- `POST /api/compose` - Generate a new composition
- `POST /api/export` - Export composition as WAV

### Data
- `GET /api/raags` - Fetch all raags
- `GET /api/instruments` - Fetch all instruments
- `GET /api/categories` - Fetch all categories

### Analysis
- `POST /api/analyze` - Analyze lyrics for mood/category

### Training
- `POST /api/training/add` - Add training song
- `GET /api/training/songs` - Fetch training songs
- `POST /api/training/compare` - Compare generated vs. popular melody

### Gallery
- `GET /api/gallery/songs` - Fetch all compositions

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Hamburger navigation, stacked layouts, touch-friendly controls
- **Tablet**: Multi-column layouts, optimized spacing
- **Desktop**: Full interface with sidebar navigation

## 🎨 Color Scheme

- **Primary**: Deep Orange (#E8622B) - Warm, classical feel
- **Secondary**: Golden (#B8860B) - Traditional Indian aesthetic
- **Accent**: Saffron (#FF9933) - Patriotic Indian colors
- **Neutral**: Cream/Dark backgrounds for contrast

## 🔐 Security

- Environment variables for sensitive keys
- Row-level security (RLS) ready for Supabase
- Input validation and sanitization
- Safe defaults for all external API calls

## 📚 Project Structure

```
app/
├── page.tsx                 # Home page
├── compose/                 # Composition interface
├── raags/                   # Raag explorer
├── training/                # Training data management
├── gallery/                 # Composition gallery
└── api/                     # Backend APIs
    ├── compose/
    ├── analyze/
    ├── training/
    └── gallery/

components/
├── navigation.tsx           # Main navigation
├── composition-form.tsx     # Composition input form
├── melody-visualizer.tsx    # Melody display
├── audio-player.tsx         # Audio playback controls
└── ui/                      # shadcn/ui components

lib/
├── db.ts                    # Database utilities
├── melody-engine.ts         # Raag-based melody generation
└── audio-synth.ts          # Audio synthesis
```

## 🚧 Future Enhancements

1. **Multi-Instrument Support**: Combine multiple instruments with harmony
2. **MIDI Export**: Export compositions as MIDI files
3. **Advanced Raag Detection**: ML-based raag recommendation
4. **User Accounts**: Save and manage compositions
5. **Collaboration**: Share and remix compositions with others
6. **Video Generation**: Sync melodies with visualization videos
7. **Real-time Learning**: Improve AI based on user feedback

## 📄 License

This project is open-source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional raag support
- More sophisticated melody algorithms
- Enhanced UI/UX
- Performance optimization
- Testing coverage

## 📞 Support

For issues, questions, or suggestions:
1. Check the documentation
2. Review the API reference
3. Open an issue on GitHub

---

**Dhun AI** - Creating beautiful classical melodies with AI and ancient wisdom 🎵
#
