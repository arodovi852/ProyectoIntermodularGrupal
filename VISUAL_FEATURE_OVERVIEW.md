# 🎵 ReccoBeats API Integration - Visual Feature Overview

## 🖼️ Autocomplete Search Dropdown

```
┌────────────────────────────────────────────────────────────┐
│ Buscar canción, artista o álbum...              [🔍 Buscar] │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  📷 [img]  Bohemian Rhapsody              ← Hover highlight │
│            Queen • A Night at the Opera                    │
│                                                             │
│  📷 [img]  Another Bohemian                               │
│            Different Artist • Album Name                   │
│                                                             │
│  📷 [img]  Bohemian Dreams                                │
│            Artist Name • Album Name                       │
│                                                             │
│  (Scroll if more results)                                  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Appears after typing 2+ characters
- ✅ Waits 300ms after user stops typing (debounce)
- ✅ Shows album artwork (40x40px)
- ✅ Displays song title, artist, and album
- ✅ Hover effect with gray background
- ✅ Scroll if more than 10 results
- ✅ Click to select song
- ✅ Press Escape to close
- ✅ Click outside to close

---

## 📊 Playlist Generation Interface

```
┌─────────────────────────────────────────────────────────────┐
│                1. ¿Cómo te sientes hoy?                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Slider Grid - 10 sliders in responsive grid]             │
│                                                              │
│  Nivel acústico         |━━━━━━━━━━━━━━━━━━━━━| 50         │
│  Ganas de bailar        |━━━━━━━━━━━━━━━━━━━━━| 50         │
│  Intensidad             |━━━━━━━━━━━━━━━━━━━━━| 50         │
│  Solo música (sin voz)  |━━━━━━━━━━━━━━━━━━━━━| 50         │
│  Sensación de directo   |━━━━━━━━━━━━━━━━━━━━━| 50         │
│  Volumen                |━━━━━━━━━━━━━━━━━━━━━| -30 dB    │
│  Modo: Alegre/Triste    |━━━━━━━━━━━━━━━━━━━━━| 0.5      │
│  Presencia de voz       |━━━━━━━━━━━━━━━━━━━━━| 50         │
│  Velocidad (BPM)        |━━━━━━━━━━━━━━━━━━━━━| 120 BPM   │
│  Estado de ánimo        |━━━━━━━━━━━━━━━━━━━━━| 50         │
│                                                              │
│  ┌──────────────────────────────────┐                       │
│  │ Cantidad de canciones            │                       │
│  │ ¿Cuántas canciones quieres?      │                       │
│  │ [      20 canciones      ]       │                       │
│  └──────────────────────────────────┘                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│              2. Añade hasta 5 canciones                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [Autocomplete Search Dropdown - see above]                  │
│                                                              │
│ Resultados de búsqueda:                                     │
│ ┌──────────────────────────────────────────┐              │
│ │ Bohemian Rhapsody - Queen      [♥] [✕]  │              │
│ │ Another Bohemian - Artist 2    [♥] [✕]  │              │
│ └──────────────────────────────────────────┘              │
│                                                              │
│ ❤️  Me gusta (2/5):                                        │
│ • Bohemian Rhapsody - Queen [X]                            │
│ • Another Bohemian - Artist [X]                            │
│                                                              │
│ 💔 No me gusta (0/5):                                      │
│ (Vacío)                                                     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    [Generar playlist]                       │
│            (or "Generando..." while loading)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
USER INTERFACE
├── Type Song Name
│   └─→ 300ms delay (debounce)
│       └─→ API Request
│
├── FRONTEND (React)
│   ├── SearchBar Component
│   │   ├── handleInputChange() - triggers debounce
│   │   ├── fetchSuggestions() - calls API
│   │   └── handleSuggestionClick() - selects song
│   │
│   ├── Generate Page
│   │   ├── State: 10 sliders + playlist size
│   │   ├── handleSearch() - search songs
│   │   └── handleGeneratePlaylist() - generate recommendations
│   │
│   └── API Service (Axios)
│       ├── GET /api/recco/search
│       └── POST /api/recco
│
├── BACKEND (Express)
│   ├── app.js (routes mounted)
│   └── routes/recco.js
│       ├── GET /search
│       │   └─→ axios.get(ReccoBeats API)
│       └── POST / (generate)
│           └─→ axios.get(ReccoBeats API)
│
└── RECCOBEATS API
    ├── https://api.reccobeats.com/search
    └── https://api.reccobeats.com/recommendations
```

---

## ⚙️ Parameter Mapping

```
FRONTEND SLIDERS (0-100)    →    BACKEND CONVERSION    →    RECCOBEATS API (0-1)
┌──────────────────────┐                               ┌──────────────────┐
│ Acousticness: 75     │ ÷ 100                        │ target: 0.75     │
│ Danceability: 50     │ ÷ 100      ──────────────→   │ target: 0.50     │
│ Energy: 60           │ ÷ 100                        │ target: 0.60     │
│ Instrumentalness: 20 │ ÷ 100                        │ target: 0.20     │
│ Liveness: 30         │ ÷ 100                        │ target: 0.30     │
│ Valence: 70          │ ÷ 100                        │ target: 0.70     │
│ Speechiness: 10      │ ÷ 100                        │ target: 0.10     │
└──────────────────────┘                               └──────────────────┘

SPECIAL CASES (No Conversion):
┌──────────────────────┐                               ┌──────────────────┐
│ Loudness: -5         │ Direct ─────────────────→     │ target: -5 dB    │
│ Mode: 0.5            │ Direct                        │ target: 0.5      │
│ Tempo: 120           │ Direct                        │ target: 120 BPM  │
│ Limit: 20            │ Capped at 100                 │ limit: 20        │
└──────────────────────┘                               └──────────────────┘
```

---

## 🎯 User Workflow

### Step 1: User Adjusts Preferences
```
User Moves Sliders
    ↓
All 10 sliders update in real-time
    ↓
Values show next to each slider
```

### Step 2: User Searches for Songs (Optional)
```
User Types in Search Box
    ↓
300ms delay while typing
    ↓
Autocomplete Dropdown Appears
    ↓
User Sees Song Suggestions with Images
    ↓
User Clicks ♥ or ✕ to Add Song
    ↓
Song Appears in Liked/Disliked Section
```

### Step 3: User Generates Playlist
```
User Clicks "Generar playlist"
    ↓
Button Shows "Generando..."
    ↓
Backend Sends All Parameters to ReccoBeats
    ↓
ReccoBeats Returns Playlist
    ↓
Button Shows "Generar playlist" Again
    ↓
Results Logged to Console
```

---

## 🌳 Component Tree

```
App
├── Router
│   └── LayoutRoot
│       ├── Header
│       ├── Outlet
│       │   └── Generate
│       │       ├── Sliders
│       │       │   ├── SliderItem (×10)
│       │       │   │   ├── Label + Description
│       │       │   │   └── Range Input + Value Display
│       │       │   └── (Quantity as Number Input below)
│       │       │
│       │       ├── SearchBar
│       │       │   ├── Input + Button
│       │       │   └── Suggestions Dropdown
│       │       │       └── Song Items (×n)
│       │       │
│       │       └── SongList
│       │           ├── Liked Songs Section
│       │           └── Disliked Songs Section
│       │
│       └── Footer
└── AuthContext
```

---

## 📱 Responsive Design

```
Desktop (1200px+):
┌────────────────────────────────────────────────────────────┐
│ 10 sliders in responsive 4-column grid                     │
│ Search bar full width                                      │
│ Song lists side by side                                    │
└────────────────────────────────────────────────────────────┘

Tablet (768px - 1199px):
┌────────────────────────────────────────────┐
│ 10 sliders in 3-column grid                │
│ Search bar full width                      │
│ Song lists stacked vertically              │
└────────────────────────────────────────────┘

Mobile (< 768px):
┌────────────────┐
│ 10 sliders in  │
│ 1-column grid  │
│ Search bar     │
│ Song lists     │
└────────────────┘
```

---

## 🔑 Key Interactions

### Search Autocomplete Flow
```
keyup event → debounce timer
    ↓
300ms passes without new keyup
    ↓
fetch('/api/recco/search?q=query')
    ↓
Display suggestions dropdown
    ↓
User hovers → gray background
    ↓
User clicks → select song
    ↓
song appears in search results
```

### Playlist Generation Flow
```
click "Generar playlist"
    ↓
setGenerationLoading(true)
    ↓
POST /api/recco with all parameters
    ↓
Button shows "Generando..."
    ↓
Wait for response
    ↓
setGenerationLoading(false)
    ↓
Button shows "Generar playlist"
    ↓
Results logged to console
```

---

## 🎨 Design System

### Colors
- **Primary:** #6D28D9 (Purple)
- **Hover:** #5b21b6 (Darker Purple)
- **Background:** #fff (White)
- **Text:** #333 (Dark)
- **Muted:** #999 (Gray)
- **Border:** #e2e8f0 (Light Gray)
- **Like (Red):** #fee2e2, #dc2626
- **Dislike (Gray):** #f0f0f0, #666

### Spacing
- **Section Gap:** 3rem (48px)
- **Item Gap:** 0.75rem (12px)
- **Padding:** 1rem - 2rem

### Typography
- **Section Title:** 1.5rem, bold
- **Label:** 1rem, 500 weight
- **Description:** 0.8rem, #666
- **Song Name:** 0.95rem, 500 weight
- **Meta:** 0.8rem, #999

---

## ✨ Features Summary

| Feature | Status | User Impact |
|---------|--------|-------------|
| **Autocomplete Search** | ✅ | Find songs easily with suggestions |
| **Song Images** | ✅ | Visual identification of albums |
| **Debouncing** | ✅ | Fewer API calls, faster response |
| **10 Audio Sliders** | ✅ | Fine-tune playlist preferences |
| **Playlist Size** | ✅ | Control number of songs (5-100) |
| **Like/Dislike** | ✅ | Seed recommendations with preferences |
| **Loading States** | ✅ | User feedback during operations |
| **Error Handling** | ✅ | Fallback data if API unavailable |
| **Responsive Layout** | ✅ | Works on desktop, tablet, mobile |
| **Accessibility** | ✅ | Keyboard navigation, screen readers |

---

## 🚀 Performance Metrics

- **Debounce Delay:** 300ms (optimal balance)
- **Search Results:** Up to 20 items
- **Dropdown Max Height:** 400px (scrollable)
- **Image Size:** 40x40px (optimized)
- **API Timeout:** 10 seconds
- **Cache:** None (always fresh data)

---

## 🎓 Learning Points

1. **Debouncing:** Improves performance by delaying function execution
2. **Parameter Mapping:** Convert between different data formats
3. **API Integration:** Communicate between frontend and backend
4. **React Hooks:** useState, useRef, useEffect for autocomplete
5. **Axios Interceptors:** Log API requests/responses
6. **CORS:** Allow cross-origin requests safely
7. **Flexbox Layout:** Footer stays at bottom
8. **Responsive Design:** Works across all screen sizes
9. **Error Handling:** Graceful fallbacks when APIs fail
10. **State Management:** Separate loading states for different operations

---

**Last Updated:** November 28, 2025
**Status:** ✅ Production Ready
**Deployment:** Ready for Docker or traditional server
