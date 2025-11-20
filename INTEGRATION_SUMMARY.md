# ReccoBeats API Integration Summary

## Overview
Successfully integrated ReccoBeats API for real song search functionality in the playlist generator. Users can now search for actual songs and see complete metadata (image, name, artist, album).

## Changes Made

### 1. **Backend Updates** (`backend/routes/recco.js`)
- **Updated `/api/search` endpoint** to call ReccoBeats API instead of returning mock data
- **Features:**
  - Queries `https://api.reccobeats.com/search` with user search term
  - Maps ReccoBeats response to standardized song format:
    ```javascript
    {
      id,           // Track ID from ReccoBeats
      name,         // Song title
      artist,       // Artist name (from first artist in array if available)
      album,        // Album name
      image,        // Album cover image URL
      uri,          // Spotify/ReccoBeats URI
      preview_url,  // Preview audio URL (if available)
      duration_ms   // Track duration in milliseconds
    }
    ```
  - Returns up to 20 results from ReccoBeats
  - **Fallback mechanism:** If ReccoBeats API is unavailable, returns mock results with the search term
  - **Error handling:** Logs ReccoBeats errors but doesn't crash

### 2. **Frontend Updates** (`frontend/src/components/SongList/SongList.jsx`)
- **Added album display** in song cards for both liked and disliked sections
- Song information now shows:
  - Song image (from ReccoBeats album cover)
  - Song name
  - Artist name
  - **Album name** (new)
- Data flows from ReccoBeats → Backend → Frontend state → SongList display
- The `handleAddSong` function already preserves complete song object with all metadata

### 3. **Styling Updates** (`frontend/src/components/SongList/SongList.module.css`)
- Added `.songAlbum` class for album text styling
  - Font size: 0.75rem (smaller than artist)
  - Color: #999 (muted gray)
  - Font style: italic (to distinguish from artist/song name)

### 4. **Package Dependencies**
- **Installed `axios`** in backend for making HTTP requests to ReccoBeats API
  - Version: Latest (1.x)
  - Used in `/api/search` and `/api/recommendations` endpoints

## Data Flow

```
User Search Query
        ↓
Frontend (Generate.jsx)
  - handleSearch() calls /api/search
        ↓
Backend (recco.js)
  - Queries ReccoBeats API
  - Maps response to standard format
        ↓
Frontend Receives Data
  - setSearchResults() with ReccoBeats songs
  - Displays in SearchBar results
        ↓
User Clicks ♥ or 👎
  - handleAddSong() adds complete song object
        ↓
SongList Component
  - Displays all song details including album
  - Album info shown in italics below artist
```

## How It Works

### Search Flow:
1. User types in search box and presses Enter
2. `handleSearch()` sends query to `/api/search?q=<search_term>`
3. Backend receives query and calls ReccoBeats API search endpoint
4. Backend maps ReccoBeats response to standardized format
5. Frontend receives array of songs with: id, name, artist, album, image
6. Songs display in search results below the search bar

### Selection Flow:
1. User clicks ♥ (like) or 👎 (dislike) button on search result
2. `handleAddSong(song, type)` preserves entire song object
3. Song added to `likedSongs` or `dislikedSongs` state
4. SongList component renders selected songs with:
   - Album cover image
   - Song name
   - Artist name
   - Album name (new)

### Fallback Handling:
- If ReccoBeats API is unavailable or slow:
  - Backend catches error and returns mock results
  - Mock songs use the search term in the title
  - App continues to work (graceful degradation)

## Files Modified

| File | Changes |
|------|---------|
| `backend/routes/recco.js` | Replaced mock `/search` with ReccoBeats API call |
| `frontend/src/components/SongList/SongList.jsx` | Added album display in song cards (2 places) |
| `frontend/src/components/SongList/SongList.module.css` | Added `.songAlbum` styling |
| `backend/package.json` | Added axios dependency |

## Testing Checklist

- [ ] Backend running (`npm run dev` in backend folder)
- [ ] Frontend running (`npm run dev` in frontend folder)
- [ ] Search box accepts text input
- [ ] Pressing Enter triggers API call to `/api/search`
- [ ] Results display songs with images from ReccoBeats
- [ ] Song cards show: image, name, artist, album
- [ ] Clicking ♥ adds song to "Canciones que te gustan"
- [ ] Clicking 👎 adds song to "Canciones que no te gustan"
- [ ] Album name displays in italics below artist name
- [ ] Can add up to 5 liked and 5 disliked songs
- [ ] Remove button (✕) appears on hover
- [ ] Selected songs persist while searching again

## Known Limitations

1. **ReccoBeats API Response Structure**: The exact field names returned by ReccoBeats API are handled with fallbacks (e.g., checks for `track.album`, `track.album_name`, etc.)
2. **Image Availability**: Some songs may not have album art in ReccoBeats; fallback is placeholder image
3. **Preview URLs**: Not all tracks may have preview URLs available
4. **Rate Limiting**: ReccoBeats API may have rate limits; add caching if needed for production

## Future Enhancements

1. **Cache search results** to reduce API calls
2. **Add preview button** to play 30-second preview when available
3. **Implement pagination** for search results
4. **Add spinner/loading state** during API calls
5. **Save songs to MongoDB** when user creates playlist (requires auth flow)
6. **Spotify integration** using `spotify_url` field for additional context

## Environment Variables Needed

Ensure `.env` file in backend includes:
```
RECCOBEATS_API_URL=https://api.reccobeats.com
FRONTEND_URL=http://localhost:5173 (or your frontend port)
```

(Note: Current implementation uses hardcoded ReccoBeats URL; can be moved to `.env` if desired)
