# Dhun AI - Quick Start Guide

Get started with Dhun AI in 5 minutes!

## 1. Installation

```bash
# Clone or navigate to the project
cd dhun-ai

# Install dependencies
npm install
# or
pnpm install
```

## 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Groq API (for AI features)
GROQ_API_KEY=your_groq_api_key_here
```

**Get these from:**
- **Supabase**: https://app.supabase.com → Settings → API Keys
- **Groq**: https://console.groq.com → API Keys

## 3. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Create Your First Composition

1. Click **"Start Composing"** on the home page
2. Enter some Hindi lyrics (or use the example below)
3. Select a Raag (e.g., "Yaman" for romantic mood)
4. Choose an Instrument (e.g., "Harmonium")
5. Click **"Compose Dhun"**
6. Play the melody or export as WAV

### Example Lyrics
```
Tere bina zindagi adhuri hai
Tere bina mera dil roye
Teri yaad mein raat bhar
Main socha karte hoon sirf tere baare mein
```

## 5. Explore Features

- **Raags Page**: Learn about Indian classical raags
- **Training Page**: Add popular songs to teach the system
- **Gallery Page**: View all your creations
- **About Page**: Understand the technology

---

## 📱 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Welcome & overview |
| Compose | `/compose` | Create melodies |
| Raags | `/raags` | Explore raag theory |
| Training | `/training` | Add training data |
| Gallery | `/gallery` | View compositions |
| About | `/about` | Learn about the project |

---

## 🎵 Understanding the Workflow

```
1. Input Lyrics
   ↓
2. Select Raag (or auto-detect mood)
   ↓
3. AI analyzes mood & recommends settings
   ↓
4. Generate melody respecting raag rules
   ↓
5. Synthesize audio with selected instrument
   ↓
6. Play, visualize, or export
```

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database (if needed)
# Run SQL migrations through Supabase dashboard
```

---

## 🎼 What is a Raag?

A raag (also spelled raga) is the foundation of Indian classical music. Each raag:

- Has specific notes it uses (aroha & avaroha)
- Has a primary note (vadi) and secondary note (samvadi)
- Evokes a specific mood or emotion
- Is performed at a specific time of day
- Is associated with a season

### Common Raags

| Raag | Mood | Time | Example Use |
|------|------|------|-------------|
| Bhairav | Devotional | Early Morning | Spiritual songs |
| Yaman | Romantic | Evening | Love songs |
| Kafi | Melancholic | Afternoon | Sad songs |
| Bhopali | Joyful | Anytime | Happy celebrations |

---

## 🎹 Instruments

The system supports these instruments:

1. **Harmonium** - Keyboard (most common)
2. **Sitar** - Plucked string
3. **Sarangi** - Bowed string
4. **Bansuri** - Flute
5. **Tabla** - Percussion

Each has unique sound characteristics modeled from the real instrument.

---

## 💡 Tips & Tricks

1. **Better Lyrics = Better Melodies**: Provide clear, emotionally rich Hindi lyrics
2. **Let AI Help**: Enable "Auto-Detect Mood" for better raag selection
3. **Experiment**: Try different raags with the same lyrics
4. **Train the System**: Add popular songs to improve future compositions
5. **Export Early**: Download your favorites before leaving

---

## 🐛 Troubleshooting

### "No raags/instruments showing"
- Check your Supabase connection in console
- Fallback sample data should load automatically

### "Composition won't generate"
- Ensure you filled in all required fields (lyrics, raag, instrument)
- Check browser console for errors
- Try refreshing the page

### "Audio not playing"
- Check browser audio permissions
- Ensure Tone.js is loaded (check Network tab)
- Try a different instrument

### "API errors"
- Verify environment variables are set correctly
- Check Groq API key is valid
- Ensure Supabase is accessible

---

## 📞 Getting Help

1. Check **API_REFERENCE.md** for API details
2. Review **README.md** for architecture
3. Look at page source code in `app/` directory
4. Check browser console for error messages

---

## 🚀 Next Steps

1. ✅ Complete the quick start above
2. 📖 Read the full [README.md](README.md)
3. 📚 Check [API_REFERENCE.md](API_REFERENCE.md) for endpoints
4. 🎵 Create your first composition!
5. 📊 Add training songs to improve the system

---

## 🎉 You're All Set!

Start composing beautiful classical melodies right now:

[🎵 Open Dhun AI](http://localhost:3000)

---

**Questions?** Check the documentation or inspect the code. Dhun AI is fully open-source!

*Happy composing!*
