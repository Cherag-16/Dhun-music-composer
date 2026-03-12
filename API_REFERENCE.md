# Dhun AI - API Reference

Complete API documentation for the Dhun AI music composition system.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, all endpoints are public. Future versions will include user authentication.

---

## 🎼 Composition Endpoints

### POST /compose
Generate a new musical composition from lyrics.

**Request Body:**
```json
{
  "lyrics": "Tere bina zindagi adhuri hain...",
  "raag_id": "2",
  "category": "Romantic",
  "instrument_id": "1",
  "tempo": 120,
  "auto_detect_mood": true,
  "title": "My Composition"
}
```

**Parameters:**
- `lyrics` (string, required): Hindi song lyrics or poem
- `raag_id` (string, required): UUID of the selected raag
- `category` (string, optional): Song category (Bhajan, Romantic, etc.)
- `instrument_id` (string, required): UUID of the instrument
- `tempo` (number, optional): Tempo in BPM (60-200, default: 120)
- `auto_detect_mood` (boolean, optional): Enable AI mood detection (default: true)
- `title` (string, optional): Composition title

**Response:**
```json
{
  "id": "uuid",
  "title": "My Composition",
  "lyrics": "Tere bina zindagi adhuri hain...",
  "raag_id": "2",
  "raag_name": "Yaman",
  "mood": "Romantic",
  "category": "Romantic",
  "instrument": "Harmonium",
  "melody": [
    {
      "note": "S",
      "frequency": 261.63,
      "duration": 1,
      "octave": 1
    },
    ...
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Missing required fields
- `404`: Raag or instrument not found
- `500`: Server error

---

### POST /export
Export a composition as a WAV file.

**Request Body:**
```json
{
  "composition": {
    "title": "My Composition",
    "melody": [
      {"note": "S", "frequency": 261.63, "duration": 1}
    ]
  }
}
```

**Response:**
- Binary WAV file
- Content-Type: `audio/wav`

**Status Codes:**
- `200`: Success (file download)
- `400`: Invalid composition data
- `500`: Export failed

---

## 📚 Data Endpoints

### GET /raags
Fetch all available raags.

**Query Parameters:** None

**Response:**
```json
[
  {
    "id": "1",
    "name": "Bhairav",
    "aroha": "S R G M P D N S",
    "avaroha": "S N D P M G R S",
    "vadi": "D",
    "samvadi": "G",
    "mood": "Devotional",
    "time_period": "Morning (Early)",
    "season": "Spring",
    "description": "Serious, majestic, spiritual"
  },
  ...
]
```

**Status Codes:**
- `200`: Success

---

### GET /instruments
Fetch all available instruments.

**Query Parameters:** None

**Response:**
```json
[
  {
    "id": "1",
    "name": "Harmonium",
    "type": "Keyboard",
    "frequency_range": "65-2100 Hz",
    "description": "Portable keyboard instrument used in classical Indian music"
  },
  ...
]
```

**Status Codes:**
- `200`: Success

---

### GET /categories
Fetch all song categories.

**Query Parameters:** None

**Response:**
```json
[
  {
    "id": "1",
    "name": "Bhajan",
    "description": "Devotional songs"
  },
  ...
]
```

**Status Codes:**
- `200`: Success

---

## 🔍 Analysis Endpoints

### POST /analyze
Analyze lyrics for mood, raag compatibility, and category.

**Request Body:**
```json
{
  "lyrics": "Tere bina zindagi adhuri hain..."
}
```

**Response:**
```json
{
  "mood": "Romantic",
  "raag": "Yaman",
  "category": "Romantic",
  "instruments": ["Harmonium", "Sitar"],
  "fullAnalysis": "Detailed analysis text...",
  "confidence": 0.85
}
```

**Status Codes:**
- `200`: Success (returns defaults on error)
- `400`: Missing lyrics

---

## 📖 Training Endpoints

### POST /training/add
Add a training song to the database for system learning.

**Request Body:**
```json
{
  "title": "Tum Hi Ho",
  "artist": "Arijit Singh",
  "movie": "Aashiqui 2",
  "lyrics": "Tere bina zindagi adhuri hain...",
  "original_melody": "S R G M P D N S",
  "raag": "Yaman",
  "category": "Romantic"
}
```

**Parameters:**
- `title` (string, required): Song title
- `artist` (string, optional): Artist name
- `movie` (string, optional): Movie name
- `lyrics` (string, required): Song lyrics
- `original_melody` (string, optional): Note sequence (helps AI learn)
- `raag` (string, optional): Associated raag
- `category` (string, optional): Song category

**Response:**
```json
{
  "success": true,
  "trainingSong": {
    "id": "uuid",
    "title": "Tum Hi Ho",
    "artist": "Arijit Singh",
    "created_at": "2024-03-11T10:30:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Missing required fields
- `500`: Database error

---

### GET /training/songs
Fetch all training songs in the database.

**Query Parameters:** None

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Tum Hi Ho",
    "artist": "Arijit Singh",
    "movie": "Aashiqui 2",
    "category": "Romantic",
    "created_at": "2024-03-11T10:30:00Z"
  },
  ...
]
```

**Status Codes:**
- `200`: Success

---

### POST /training/compare
Compare a generated melody with an original training melody.

**Request Body:**
```json
{
  "training_song_id": "uuid",
  "generated_melody": "S R G M P D N S",
  "original_melody": "S R G M P D N S"
}
```

**Response:**
```json
{
  "success": true,
  "comparison": {
    "id": "uuid",
    "similarity_score": 85,
    "notes": "Good match in ascending pattern, minor variation in descent"
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Missing required fields
- `500`: Comparison failed

---

## 🖼️ Gallery Endpoints

### GET /gallery/songs
Fetch all generated compositions.

**Query Parameters:**
- `category` (string, optional): Filter by category
- `limit` (number, optional): Maximum results (default: 50)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "My Composition",
    "lyrics": "Tere bina zindagi adhuri hain...",
    "category": "Romantic",
    "mood": "Romantic",
    "instrument": "Harmonium",
    "raag_name": "Yaman",
    "created_at": "2024-03-11T10:30:00Z"
  },
  ...
]
```

**Status Codes:**
- `200`: Success

---

## 🎵 Data Models

### Raag
```typescript
interface Raag {
  id: string
  name: string
  aroha: string          // Ascending note pattern
  avaroha: string        // Descending note pattern
  vadi: string          // Primary note
  samvadi: string       // Secondary note
  mood: string          // Emotional character
  time_period: string   // Best time to play
  season: string        // Associated season
  description: string
  created_at: Date
}
```

### Instrument
```typescript
interface Instrument {
  id: string
  name: string
  type: string          // Keyboard, String, Wind, Percussion
  frequency_range: string
  description: string
  created_at: Date
}
```

### MelodyNote
```typescript
interface MelodyNote {
  note: string          // S, R, G, M, P, D, N
  frequency: number     // Hz
  duration: number      // Beats
  octave: number
}
```

### Composition
```typescript
interface Composition {
  id: string
  title: string
  lyrics: string
  raag_id: string
  category: string
  mood: string
  instrument_ids: string[]
  melody_notes: string  // JSON stringified
  audio_data?: string   // Optional base64 encoded audio
  created_at: Date
}
```

### TrainingSong
```typescript
interface TrainingSong {
  id: string
  title: string
  artist?: string
  movie?: string
  lyrics: string
  original_melody?: string
  raag_id?: string
  category?: string
  mood?: string
  created_at: Date
}
```

---

## 🔒 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Error Codes:**
- `400`: Bad Request - Invalid parameters
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server-side problem

---

## 📊 Rate Limiting

Currently, no rate limiting is implemented. This will be added in future versions.

---

## 🔮 Future Endpoints (Phase 2+)

- `POST /api/users/auth` - User authentication
- `GET /api/users/compositions` - User's saved compositions
- `POST /api/users/compositions/{id}/share` - Share composition
- `POST /api/ml/train` - Train ML model on compositions
- `GET /api/recommendations` - Get AI composition recommendations

---

## 💡 Usage Examples

### Example 1: Generate a Composition
```javascript
const response = await fetch('/api/compose', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lyrics: 'Tere bina zindagi adhuri hain...',
    raag_id: '2',
    instrument_id: '1',
    tempo: 120,
    auto_detect_mood: true,
    title: 'My Love Song'
  })
})

const composition = await response.json()
console.log(composition.melody) // Array of notes
```

### Example 2: Export Composition
```javascript
const response = await fetch('/api/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ composition })
})

const blob = await response.blob()
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'composition.wav'
a.click()
```

### Example 3: Get Raags
```javascript
const response = await fetch('/api/raags')
const raags = await response.json()

raags.forEach(raag => {
  console.log(`${raag.name}: ${raag.mood} - ${raag.description}`)
})
```

---

**Last Updated:** March 2024
**API Version:** 1.0
