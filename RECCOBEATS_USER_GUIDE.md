# ReccoBeats Search Integration - User Guide

## What Changed

Your playlist generator now connects to the **ReccoBeats API** to search for real songs. When you search for music, you'll get actual tracks with complete metadata from ReccoBeats.

## How to Use

### 1. Search for Songs
- Click the search box at the top of the Generate page
- Type a song name, artist name, or keyword
- Press **Enter** to search
- Results appear below the search box within seconds

### 2. Song Results Display
Each search result shows:
- **Album Cover Image** - The actual album artwork from ReccoBeats
- **Song Name** - Title of the track
- **Artist Name** - Who performed the song
- **Two Action Buttons:**
  - ♥ (Heart) - Add to "Canciones que te gustan" (Liked)
  - 👎 (Thumbs Down) - Add to "Canciones que no te gustan" (Disliked)

### 3. Add Songs to Playlist
- Click the ♥ button to add a song to your **liked songs** section
- Click the 👎 button to add a song to your **disliked songs** section
- You can add up to **5 songs** in each category
- Once selected, songs move to the sections below with:
  - Album cover
  - Song name
  - Artist name
  - **Album name** (in italics) ← NEW
  - Remove button (✕) on hover

### 4. Generate Your Playlist
1. Adjust the 8 sliders to fine-tune the mood:
   - Bailabilidad (Danceability)
   - Acusticidad (Acousticness)
   - Energía (Energy)
   - Instrumentalidad (Instrumentalness)
   - Ruido (Loudness)
   - Modo (Mode)
   - Tempo
   - Valencia (Valence)
2. Click **"Generar Playlist"** button
3. The system generates recommendations based on:
   - Your slider settings
   - Your liked/disliked songs as reference points
   - ReccoBeats audio analysis

## What's New (Technical Details)

### Search Results Now Include:
- ✅ **Real songs from ReccoBeats API** (not mock data)
- ✅ **Album cover images** from ReccoBeats
- ✅ **Complete metadata**: song name, artist, album, preview URL

### Backend Integration:
- Frontend `/api/search` endpoint queries ReccoBeats API
- Results are automatically formatted for display
- Graceful fallback if ReccoBeats is temporarily unavailable

### Improved Song Cards:
- Selected songs now display **album name**
- Album name appears in italics below the artist name
- Full ReccoBeats metadata is preserved for future features (previews, etc.)

## Example Search

**Search: "Bohemian Rhapsody"**

Results might include:
1. **Bohemian Rhapsody** by Queen
   - Album: *A Night at the Opera*
   - Image: Album cover art
   - Action: ♥ or 👎

2. **Bohemian Rhapsody (Remaster)** by Queen
   - Album: *A Night at the Opera (Remaster)*
   - Image: Updated album artwork
   - Action: ♥ or 👎

Once selected, each song card shows all three pieces of information.

## Error Handling

If ReccoBeats API is temporarily unavailable:
- App automatically shows placeholder results with your search term
- You can still test the UI with demo songs
- App continues to function normally

## Tips for Best Results

1. **Search with specific terms** for better matching:
   - ❌ "music" → Too broad
   - ✅ "Beatles Let It Be" → Better match

2. **Use artist + song name** for precision:
   - "Adele Rolling in the Deep" → Finds exact track
   - "Rolling in the Deep" → Also works but broader

3. **Mix liked and disliked songs** for better recommendations:
   - Like songs you want similar to
   - Dislike songs you want to avoid
   - Use sliders to fine-tune the exact mood

4. **Try different slider values** to explore:
   - High danceability + High energy = Party mood
   - Low energy + High acousticness = Chill mood
   - High tempo + High valence = Happy upbeat

## Data Being Used

From ReccoBeats API, each song includes:
- Song ID (for database storage)
- Track name
- Artist name(s)
- Album information
- Album cover image URL
- Preview URL (if available)
- Duration
- Audio features (used for recommendations)

All this data flows through your system to create personalized playlists!

## Next Steps

After implementing this integration, future features could include:
- 🎵 **Preview buttons** - Click to listen to 30-second previews
- 💾 **Save playlists** - Store created playlists in MongoDB
- 📊 **Playlist stats** - Show audio feature breakdown
- 🔗 **Spotify links** - Open songs directly in Spotify
- 📱 **Mobile responsive** - Better UI for phones/tablets
