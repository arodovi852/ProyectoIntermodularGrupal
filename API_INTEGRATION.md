# API Integration Guide - ReccoBeats & MERN Stack

## 📡 Architecture Overview

```
Frontend (React/Vite)
    ↓
Axios Client (api.js)
    ↓
Backend Express Server (port 3001)
    ↓
ReccoBeats API
    └─ https://api.reccobeats.com/search
    └─ https://api.reccobeats.com/recommendations
```

---

## 🔌 Backend Setup (MERN)

### 1. Route Registration (`backend/src/app.js`)

```javascript
// Import recco routes
const reccoRoutes = require('../../routes/recco');

// Mount at /api/recco
app.use('/api/recco', reccoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend funcionando' });
});
```

### 2. Available Endpoints

#### **GET /api/recco/search**
Search for songs from the ReccoBeats database.

**Request:**
```bash
GET http://localhost:3001/api/recco/search?q=Bohemian%20Rhapsody
```

**Query Parameters:**
- `q` (string, required): Song name, artist, or album to search for

**Response:**
```json
[
  {
    "id": "3z8h0s8",
    "name": "Bohemian Rhapsody",
    "artist": "Queen",
    "album": "A Night at the Opera",
    "image": "https://...",
    "uri": "spotify:track:...",
    "preview_url": "https://...",
    "duration_ms": 354000
  }
]
```

#### **POST /api/recco** (Recommendations)
Generate a playlist based on audio features and user preferences.

**Request:**
```bash
POST http://localhost:3001/api/recco
Content-Type: application/json

{
  "acousticness": 75,
  "danceability": 50,
  "energy": 60,
  "instrumentalness": 20,
  "liveness": 30,
  "loudness": -5,
  "mode": 1,
  "valence": 70,
  "speechiness": 10,
  "tempo": 120,
  "limit": 20,
  "likedSongs": ["spotify:track:123", "spotify:track:456"],
  "dislikedSongs": []
}
```

**Parameters:**
| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| acousticness | number | 0-100 | Acoustic vs electronic (converted to 0-1) |
| danceability | number | 0-100 | How danceable (converted to 0-1) |
| energy | number | 0-100 | Intensity level (converted to 0-1) |
| instrumentalness | number | 0-100 | Instrumental vs vocal (converted to 0-1) |
| liveness | number | 0-100 | Live vs studio (converted to 0-1) |
| loudness | number | -60 to 0 | Volume in dB (no conversion) |
| mode | number | 0-1 | Minor (0) or Major (1) |
| valence | number | 0-100 | Cheerful vs sad (converted to 0-1) |
| speechiness | number | 0-100 | Spoken words (converted to 0-1) |
| tempo | number | 40-200 | Speed in BPM (no conversion) |
| limit | number | 5-100 | Number of songs (capped at 100) |
| likedSongs | array | - | Seed tracks for recommendations |
| dislikedSongs | array | - | Tracks to avoid |

**Response:**
```json
{
  "tracks": [
    {
      "id": "...",
      "name": "Song Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "image": "...",
      "uri": "...",
      "preview_url": "...",
      "duration_ms": 200000
    }
  ]
}
```

---

## 🎯 Frontend Implementation

### 1. API Service Setup (`frontend/src/services/api.js`)

```javascript
import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment
    ? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001')
    : '';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request logging
api.interceptors.request.use((config) => {
    console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
});

export default api;
```

### 2. Environment Configuration (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3001
```

### 3. SearchBar with Autocomplete

The SearchBar component now includes:
- **Autocomplete dropdown** with song suggestions
- **Debounced search** (waits 300ms after user stops typing)
- **Song images** from ReccoBeats database
- **Click to select** a song from suggestions

**Key Features:**
```javascript
// Debounced fetch from /api/recco/search
const fetchSuggestions = async (query) => {
    const res = await api.get('/api/recco/search', {
        params: { q: query }
    });
    setSuggestions(res.data || []);
}

// Handle suggestion click
const handleSuggestionClick = (song) => {
    onChange(song.name);
    onSearch(song); // Pass selected song object
}
```

### 4. Generate Page Integration

The Generate page calls the recommendations endpoint:

```javascript
const handleGeneratePlaylist = async () => {
    setGenerationLoading(true);
    try {
        const res = await api.post('/api/recco', {
            acousticness,
            danceability,
            energy,
            // ... all other parameters
            limit: playlistSize,
            likedSongs: likedSongs.map(s => s.id),
            dislikedSongs: dislikedSongs.map(s => s.id),
        });
        console.log('Playlist generated:', res.data);
        // TODO: Display results to user
    } catch (err) {
        console.error('Generation error:', err);
    } finally {
        setGenerationLoading(false);
    }
};
```

---

## 🚀 How to Test

### 1. Start Backend
```bash
cd backend
npm run dev
# Server running on http://localhost:3001
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

### 3. Test Search with Autocomplete
1. Navigate to **Generate** page
2. In "Buscar canción..." input, type a song name (e.g., "Bohemian")
3. Wait 300ms for autocomplete suggestions to appear
4. See list of songs with:
   - Album cover images
   - Song title
   - Artist and album name
5. Click a song to select it
6. Song appears in search results below

### 4. Test Playlist Generation
1. Adjust the sliders to set preferences
2. (Optional) Add liked/disliked songs
3. Set quantity of songs
4. Click "Generar playlist"
5. Button shows "Generando..." while loading
6. Results logged to console (TODO: Display in UI)

### 5. Test Health Check (Terminal)
```bash
curl http://localhost:3001/api/health
# Response: {"status":"ok","message":"Backend funcionando"}
```

---

## 🔄 Data Flow

### Search Flow
```
User types in SearchBar
    ↓ (300ms debounce)
Frontend: GET /api/recco/search?q=query
    ↓
Backend: axios.get('https://api.reccobeats.com/search')
    ↓
ReccoBeats API
    ↓
Backend: Format & return songs
    ↓
Frontend: Display in autocomplete dropdown
    ↓
User clicks song → Triggers handleSearch(song)
    ↓
Frontend: Display song in search results
```

### Playlist Generation Flow
```
User adjusts sliders
    ↓
User clicks "Generar playlist"
    ↓
Frontend: POST /api/recco with all parameters
    ↓
Backend: Map parameters (0-100 → 0-1, etc.)
    ↓
Backend: axios.get('https://api.reccobeats.com/recommendations')
    ↓
ReccoBeats API
    ↓
Backend: Return playlist
    ↓
Frontend: Console log results
    ↓ (TODO)
Frontend: Display playlist to user
```

---

## 🛠️ Troubleshooting

### "Cannot GET /api/recco/search"
- ✅ Check: recco route mounted in `backend/src/app.js`
- ✅ Check: Backend running on port 3001
- ✅ Verify: `app.use('/api/recco', reccoRoutes);`

### "CORS Error"
- ✅ Check: `origin: '*'` in `app.use(cors(...))`
- ✅ Check: Backend allows all methods: GET, POST, PUT, DELETE, PATCH

### No autocomplete suggestions appear
- ✅ Check: Type at least 2 characters
- ✅ Check: Browser console for errors (F12)
- ✅ Check: Network tab to see API request
- ✅ Check: ReccoBeats API is responding

### Search results are mock data
- ⚠️ This is normal if ReccoBeats API is not responding
- ✅ Check: Backend console for "ReccoBeats search error"
- ✅ Verify: Internet connection
- ✅ Verify: ReccoBeats API is operational

### Playlist generation shows loading forever
- ✅ Check: Backend console for errors
- ✅ Check: Browser Network tab (is request sent?)
- ✅ Check: Response status (should be 200)

---

## 📊 Parameter Mapping Reference

| Frontend (0-100) | Backend Conversion | ReccoBeats API | Range |
|-----------------|------------------|----------------|-------|
| Acousticness | ÷ 100 | target_acousticness | 0-1 |
| Danceability | ÷ 100 | target_danceability | 0-1 |
| Energy | ÷ 100 | target_energy | 0-1 |
| Instrumentalness | ÷ 100 | target_instrumentalness | 0-1 |
| Liveness | ÷ 100 | target_liveness | 0-1 |
| Valence | ÷ 100 | target_valence | 0-1 |
| Speechiness | ÷ 100 | target_speechiness | 0-1 |
| Loudness | Direct | target_loudness | -60 to 0 dB |
| Mode | Direct | target_mode | 0-1 |
| Tempo | Direct | target_tempo | 40-200 BPM |
| Limit | Capped at 100 | limit | 5-100 |

---

## 🐳 Docker Deployment

When using Docker, the frontend communicates with backend via `http://backend:3001` (internal network):

```yaml
# docker-compose.yml
services:
  backend:
    ports:
      - "3001:3001"
  frontend:
    environment:
      - VITE_BACKEND_URL=http://backend:3001
```

---

## ✅ Implementation Checklist

- [x] Backend: Mount recco route at `/api/recco`
- [x] Backend: GET `/api/recco/search` - queries ReccoBeats
- [x] Backend: POST `/api/recco` - generates playlist
- [x] Backend: Health check endpoint (`/api/health`)
- [x] Frontend: Axios configured with base URL
- [x] Frontend: Environment variable support
- [x] Frontend: SearchBar with autocomplete dropdown
- [x] Frontend: Debounced search (300ms delay)
- [x] Frontend: Song images display in autocomplete
- [x] Frontend: Click to select song from suggestions
- [x] Frontend: Separate loading states (search vs generation)
- [x] Frontend: Number input for playlist size
- [x] Frontend: Footer stays at bottom
- [ ] TODO: Display playlist results in UI
- [ ] TODO: Save playlist to MongoDB
- [ ] TODO: User authentication for persistence

---

## 📝 Next Steps

1. **Display Playlist Results**: Create a results component to show generated songs
2. **Save Playlists**: Implement MongoDB storage for user playlists
3. **User Profiles**: Store user preferences and playlist history
4. **Sharing**: Allow users to share playlists via URL
5. **Export**: Export playlist to Spotify or other services

---

## 🔗 Useful Links

- **ReccoBeats API**: https://api.reccobeats.com
- **Axios Documentation**: https://axios-http.com
- **React Documentation**: https://react.dev
- **Express Documentation**: https://expressjs.com

---

## 📧 Support

For issues or questions about the API integration:
1. Check browser console (F12) for error messages
2. Check backend terminal for server logs
3. Use curl to test endpoints directly
4. Verify backend is running: `curl http://localhost:3001/api/health`
