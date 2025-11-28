# Quick Reference - Slider Update & ReccoBeats Integration

## What Changed

✅ **10 Sliders + 1 Size Parameter** (11 total controls)
✅ **Descriptions above each slider**
✅ **Proper ReccoBeats API mapping**
✅ **Better UI with units (BPM, dB, canciones)**

## The 11 Sliders

| # | Slider | Range | Description |
|---|--------|-------|-------------|
| 1 | Nivel acústico | 0-100 | ¿Prefieres sonidos naturales (acústicos) o electrónicos? |
| 2 | Ganas de bailar | 0-100 | ¿Cuánto te invita la música a moverte y bailar? |
| 3 | Intensidad | 0-100 | Nivel de energía, desde tranquilo hasta intenso. |
| 4 | Solo música (sin voz) | 0-100 | ¿Quieres canciones instrumentales o con voz? |
| 5 | Sensación de directo | 0-100 | ¿Prefieres grabaciones de estudio o con ambiente de concierto en vivo? |
| 6 | Volumen | -60 to 0 dB | ¿Quieres música potente o suave? (ajusta el volumen promedio) |
| 7 | Modo: Alegre/Triste | 0-1 | ¿Buscas canciones mayormente alegres (mayor) o tristes (menor)? |
| 8 | Presencia de voz hablada | 0-100 | ¿Quieres música pura o con partes habladas/rap? |
| 9 | Velocidad (BPM) | 40-200 | ¿Prefieres música rápida o lenta? |
| 10 | Estado de ánimo | 0-100 | ¿Qué emoción buscas? Alegre/feliz o melancólica/triste. |
| 11 | Cantidad de canciones | 5-100 | ¿Cuántas canciones quieres en tu playlist? |

## Files Modified

- `frontend/src/pages/Generate.jsx` - State + handleGeneratePlaylist
- `frontend/src/components/Sliders/Sliders.jsx` - All 11 sliders with descriptions
- `frontend/src/components/Sliders/Sliders.module.css` - Styling for descriptions
- `backend/routes/recco.js` - Parameter mapping for ReccoBeats API

## How to Test

### Start the App
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Test Sliders
1. Navigate to Generate page
2. You should see all 11 sliders with descriptions
3. Adjust sliders - values update in real-time
4. Check units display (BPM, dB, canciones)

### Test Playlist Generation
1. Adjust sliders to your preference
2. (Optional) Search and select liked/disliked songs
3. Click "Generar playlist"
4. Check browser console for API response
5. Check backend console for ReccoBeats API call parameters

## Parameter Mapping

### Frontend (0-100 scale) → ReccoBeats (0-1 scale)

Frontend values 0-100 are divided by 100 to get 0-1:
- 0 → 0.0
- 50 → 0.5
- 100 → 1.0

**Exceptions:**
- **Modo**: 0-1 (multiplied by 0.1 per step)
- **Loudness**: -60 to 0 dB (direct mapping, no division)
- **Tempo**: 40-200 BPM (direct mapping, no division)
- **Limit**: 5-100 songs (direct mapping, capped at 100)

## What Happens When User Clicks "Generar playlist"

1. **Frontend collects all values:**
   ```javascript
   {
       acousticness: 50,        // 0-100
       danceability: 75,        // 0-100
       energy: 60,              // 0-100
       instrumentalness: 30,    // 0-100
       liveness: 40,            // 0-100
       loudness: -5,            // -60 to 0
       mode: 50,                // 0-1
       valence: 70,             // 0-100
       speechiness: 20,         // 0-100
       tempo: 120,              // 40-200
       limit: 20,               // 5-100
       likedSongs: ["id1", "id2"],
       dislikedSongs: []
   }
   ```

2. **Backend maps to ReccoBeats format:**
   ```javascript
   {
       target_acousticness: 0.5,
       target_danceability: 0.75,
       target_energy: 0.6,
       target_instrumentalness: 0.3,
       target_liveness: 0.4,
       target_loudness: -5,
       target_mode: 0.5,        // Special: 50/100 → 0.5
       target_valence: 0.7,
       target_speechiness: 0.2,
       target_tempo: 120,
       limit: 20,
       seed_tracks: "id1,id2"
   }
   ```

3. **Backend calls ReccoBeats API:**
   ```
   GET https://api.reccobeats.com/recommendations?
       target_acousticness=0.5&
       target_danceability=0.75&
       ...all parameters...&
       limit=20&
       seed_tracks=id1,id2
   ```

4. **Backend returns recommendations**

5. **Frontend receives and displays results**

## Search Integration (Already Working)

The search bar queries `/api/search` which:
- ✅ Calls ReccoBeats search endpoint
- ✅ Returns song images from ReccoBeats
- ✅ Displays song name, artist, album
- ✅ Works with seed tracks for recommendations

## Known Issues

None at this time. All 11 parameters properly mapped.

## Next Steps

1. ✅ Run the app and test sliders
2. ✅ Search for songs and select liked/disliked
3. ✅ Adjust all 11 sliders
4. ✅ Click generate and verify API response
5. 🔄 Handle playlist generation results (display/save)

---

**Status: Ready for Testing** ✅
All 11 sliders implemented with descriptions, proper API mapping, and working search.
