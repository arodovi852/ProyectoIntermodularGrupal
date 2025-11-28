# 🎵 ReccoBeats API Integration - Quick Reference

## ⚡ Quick Start

### Backend Running?
```bash
cd backend
npm run dev
# ✅ Server on http://localhost:3001
```

### Frontend Running?
```bash
cd frontend
npm run dev
# ✅ App on http://localhost:5173
```

### Check Health
```bash
curl http://localhost:3001/api/health
# {"status":"ok","message":"Backend funcionando"}
```

---

## 🔍 Autocomplete Search Feature

### How It Works
1. User types in "Buscar canción..." field
2. After 300ms of inactivity → autocomplete request sent
3. **GET** `/api/recco/search?q=query`
4. Returns list of songs with:
   - 🖼️ Album cover image
   - 🎵 Song title
   - 🎤 Artist & Album name
5. User clicks → song selected
6. Song appears in search results section

### What You'll See
```
┌─────────────────────────────────────────┐
│ Buscar canción, artista o álbum... [🔍] │
├─────────────────────────────────────────┤
│ ▢ 📷 Bohemian Rhapsody                  │
│    Queen • A Night at the Opera         │
│ ▢ 📷 Another Bohemian                   │
│    Artist • Album                       │
│ ▢ 📷 Bohemian Dreams                    │
│    Different Artist • Album             │
└─────────────────────────────────────────┘
```

---

## 🎚️ Playlist Generation

### Parameters (All 0-100 sliders)
| Slider | Effect | Range |
|--------|--------|-------|
| 🎵 Nivel acústico | Natural vs Electronic | 0-100 |
| 💃 Ganas de bailar | Danceable | 0-100 |
| ⚡ Intensidad | Energy level | 0-100 |
| 🎹 Solo música | Instrumental | 0-100 |
| 🎤 Sensación de directo | Live concert feel | 0-100 |
| 🔊 Volumen | Loudness in dB | -60 to 0 |
| 😊 Modo | Alegre/Triste | 0-1 |
| 🗣️ Presencia de voz | Spoken words | 0-100 |
| 🚀 Velocidad | BPM (tempo) | 40-200 |
| 💛 Estado de ánimo | Cheerful/Sad | 0-100 |
| 📊 Cantidad | Songs in playlist | 5-100 |

### Steps
1. ✅ Adjust all sliders
2. ✅ (Optional) Add liked/disliked songs
3. ✅ Set quantity of songs
4. ✅ Click **"Generar playlist"**
5. ⏳ Button shows "Generando..." while loading
6. ✅ Results logged to console (see DevTools → Console)

---

## 🔗 API Endpoints

### Search
```
GET /api/recco/search?q=bohemian

Response:
[
  {
    id: "spotify:track:123",
    name: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    image: "https://...",
    uri: "spotify:track:123",
    preview_url: "https://...",
    duration_ms: 354000
  }
]
```

### Generate Playlist
```
POST /api/recco

Body:
{
  acousticness: 75,
  danceability: 50,
  energy: 60,
  instrumentalness: 20,
  liveness: 30,
  loudness: -5,
  mode: 1,
  valence: 70,
  speechiness: 10,
  tempo: 120,
  limit: 20,
  likedSongs: ["id1", "id2"],
  dislikedSongs: []
}

Response:
{
  tracks: [
    { id, name, artist, album, image, ... },
    { id, name, artist, album, image, ... }
  ]
}
```

---

## 🐛 Debugging

### Problem: No autocomplete suggestions
**Check:**
- Type at least 2 characters
- Backend is running (`npm run dev` in backend/)
- Network tab shows request to `/api/recco/search`
- Console shows no errors (F12 → Console)

### Problem: "Cannot GET /api/recco/search"
**Check:**
- recco route mounted in `backend/src/app.js`:
  ```javascript
  app.use('/api/recco', reccoRoutes);
  ```
- Backend restarted after changes
- Using correct URL: `/api/recco/search` (not `/api/search`)

### Problem: Suggestions show but clicking does nothing
**Check:**
- `onSearch` prop passed correctly to SearchBar
- Browser console for errors
- Network tab for response status

### Problem: Playlist generation takes too long
**Check:**
- ReccoBeats API is operational
- Internet connection stable
- Backend console for error messages
- Check `/api/health` endpoint works

---

## 📂 Key Files

| File | Purpose | Key Function |
|------|---------|--------------|
| `backend/src/app.js` | Main server | Routes mounted |
| `backend/routes/recco.js` | API routes | GET search, POST generate |
| `frontend/src/services/api.js` | Axios config | API base URL, interceptors |
| `frontend/src/components/SearchBar/SearchBar.jsx` | Autocomplete | Debounced search, dropdown |
| `frontend/src/pages/Generate.jsx` | Main page | State management, API calls |
| `frontend/.env` | Config | `VITE_BACKEND_URL` |

---

## 🚀 To Run Locally

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

### Terminal 3 - Monitor
```bash
# (Optional) Test endpoints
curl http://localhost:3001/api/health
```

---

## 📊 Parameter Conversion

Backend automatically converts values:

```javascript
// Frontend sends 0-100
const sliderValue = 75;

// Backend converts to 0-1
const apiValue = sliderValue / 100;  // 0.75

// Special cases:
- Loudness: Direct (-60 to 0 dB)
- Mode: Direct (0-1 for major/minor)
- Tempo: Direct (40-200 BPM)
- Limit: Capped at 100
```

---

## ✅ Feature Checklist

- [x] **Autocomplete Search** - Type song name, see suggestions
- [x] **Debounced Search** - Waits 300ms before sending request
- [x] **Song Images** - Album covers displayed
- [x] **Click to Select** - Choose from suggestions
- [x] **10 Audio Sliders** - All with Spanish descriptions
- [x] **Playlist Size Input** - Number field (5-100)
- [x] **Playlist Generation** - All parameters sent to API
- [x] **API Connection** - Backend → ReccoBeats → Frontend
- [x] **Health Check** - `/api/health` endpoint
- [ ] Display Results - UI for generated playlist
- [ ] Save Playlists - MongoDB storage
- [ ] User Auth - Login/signup persistence

---

## 🎯 Current Limitations & TODOs

1. **Playlist results** logged to console only (need UI display)
2. **No persistence** - Playlists not saved to database
3. **No authentication** - Can't save personal playlists
4. **Mock fallback** - If API fails, shows demo results

---

## 📞 Testing Commands

### Test Search Endpoint
```bash
curl "http://localhost:3001/api/recco/search?q=bohemian"
```

### Test Recommendations Endpoint
```bash
curl -X POST http://localhost:3001/api/recco \
  -H "Content-Type: application/json" \
  -d '{
    "acousticness": 50,
    "danceability": 75,
    "energy": 60,
    "instrumentalness": 20,
    "liveness": 30,
    "loudness": -5,
    "mode": 1,
    "valence": 70,
    "speechiness": 10,
    "tempo": 120,
    "limit": 10,
    "likedSongs": [],
    "dislikedSongs": []
  }'
```

### Check Backend Status
```bash
curl http://localhost:3001/api/health
```

---

## 🎓 How the Debounce Works

```javascript
// User types "b"     → Timer set (300ms)
// User types "bo"    → Timer reset (300ms)
// User types "boh"   → Timer reset (300ms)
// User types "bohe"  → Timer reset (300ms)
// User types "bohem" → Timer reset (300ms)
// User stops typing  → 300ms passes → API request sent!
```

Result: Fewer API calls, better performance ✅

---

## 🌐 CORS Configuration

Backend allows all origins:
```javascript
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
```

Safe for development. In production, restrict to your domain.

---

## 🔄 Data Flow Visualization

```
User Interface
   ↓
[SearchBar] Types "bohemian" (300ms debounce)
   ↓
[Frontend] POST /api/recco/search?q=bohemian
   ↓
[Backend] axios.get('https://api.reccobeats.com/search')
   ↓
[ReccoBeats API] Returns song list
   ↓
[Backend] Formats data, returns to frontend
   ↓
[Frontend] Displays suggestions dropdown with images
   ↓
User clicks song
   ↓
[Frontend] Triggers handleGeneratePlaylist()
   ↓
[Frontend] POST /api/recco (with all slider values)
   ↓
[Backend] Maps parameters (0-100 → 0-1)
   ↓
[Backend] axios.get('https://api.reccobeats.com/recommendations')
   ↓
[ReccoBeats API] Returns recommendations
   ↓
[Backend] Returns playlist to frontend
   ↓
[Frontend] Logs to console (TODO: Display in UI)
```

---

**Status**: ✅ API Integration Complete
**Next Step**: Display playlist results in a results component
**Deployment**: Ready for Docker or traditional server

