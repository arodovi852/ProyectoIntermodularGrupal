# ReccoBeats Integration - Quick Start Guide

## 🚀 Getting Started

### Step 1: Install Dependencies
Backend needs axios for API calls:
```bash
cd backend
npm install axios
```

### Step 2: Start the Backend
```bash
npm run dev
# Server runs on port 3001 or 4000 (check your .env)
```

### Step 3: Start the Frontend
In a new terminal:
```bash
cd frontend
npm run dev
# App runs on port 5173 or as configured in vite.config.js
```

### Step 4: Open Application
Visit: `http://localhost:5173` (or your configured frontend port)

### Step 5: Test the Search
1. Click on the Generate page (from Hero CTA or navigation)
2. Type a song name in the search box (e.g., "Imagine", "Bohemian Rhapsody")
3. Press **Enter**
4. Results should appear within 2-3 seconds with:
   - Album artwork from ReccoBeats
   - Song name
   - Artist name
   - Like (♥) and Dislike (👎) buttons

### Step 6: Select Songs
1. Click ♥ on any song to add to "Canciones que te gustan"
2. Click 👎 on any song to add to "Canciones que no te gustan"
3. Each section allows max 5 songs
4. Selected songs display with album name in italics

### Step 7: Adjust Sliders (Optional)
Move the 8 sliders to fine-tune the generated playlist mood:
- **Bailabilidad**: How danceable (0-100)
- **Acusticidad**: Acoustic vs Electric (0-100)
- **Energía**: Energy level (0-100)
- **Instrumentalidad**: Vocal vs Instrumental (0-100)
- **Ruido**: Loudness level (0-100)
- **Modo**: Major vs Minor mode
- **Tempo**: Beats per minute (0-200)
- **Valencia**: Happy/Positive vs Sad/Negative (0-100)

### Step 8: Generate Playlist (Optional)
1. Click **"Generar Playlist"** button
2. Backend sends request to ReccoBeats API with:
   - Your slider settings
   - Your liked/disliked songs as reference
3. Receive recommendations based on your preferences

## 📝 What Was Added

### Code Changes
- ✅ **Backend**: `/api/search` now queries ReccoBeats API
- ✅ **Frontend**: SongList displays album name
- ✅ **Styling**: Album text styled in italics
- ✅ **Package**: Axios installed for HTTP requests

### New Features
- 🎵 Real song search from ReccoBeats
- 🖼️ Album artwork display
- 📝 Album name in song cards
- 🔄 Complete metadata preservation

## 🐛 Troubleshooting

### Issue: "Network Error" when searching
**Solution:**
- Check backend is running: `npm run dev` in backend folder
- Check frontend can reach backend (check VITE_BACKEND_URL)
- Check ReccoBeats API is accessible (may be rate limited)

### Issue: Images not loading
**Possible Causes:**
- ReccoBeats API not returning image URLs
- CORS issue with image URLs
- Fallback placeholder image is shown if actual image fails

**Solution:**
- Check browser console for errors
- Verify ReccoBeats API response in network tab
- Fallback placeholder URLs are always available

### Issue: Album name not appearing
**Cause:** Song object might not have `album` field
**Solution:** Check if ReccoBeats returns album information

### Issue: Search returns no results
**Cause 1:** ReccoBeats API is unavailable
**Solution:** Mock fallback should show demo songs

**Cause 2:** Search term is too vague
**Solution:** Try more specific artist or song name

### Issue: Can't add more than 5 songs
**Expected Behavior:** This is intentional - max 5 liked + 5 disliked
**To add more:** Remove a song first using the ✕ button

## 📊 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can navigate to Generate page
- [ ] Search box is visible
- [ ] Search results appear after pressing Enter
- [ ] Results show album artwork
- [ ] Results show song name, artist, and album
- [ ] ♥ button adds song to liked section
- [ ] 👎 button adds song to disliked section
- [ ] Album name appears in italics in selected songs
- [ ] Can add up to 5 songs in each section
- [ ] ✕ button removes songs on hover
- [ ] No console errors

## 🔍 Debugging

### Check Backend Console
```
npm run dev
# Look for:
# - "listening on port..."
# - Successful connection messages
# - Error logs if search fails
```

### Check Frontend Console
Open browser DevTools (F12):
- Check **Console** tab for errors
- Check **Network** tab for `/api/search` requests
- Look for response status and payload

### Check ReccoBeats API Response
In browser Network tab:
1. Search for a song
2. Find `search?q=...` request
3. Click on it
4. Check **Response** tab
5. Verify it contains track data with images

## 📱 API Endpoints

### Frontend calls Backend:
```
GET /api/search?q=bohemian
```

Backend calls ReccoBeats:
```
GET https://api.reccobeats.com/search?q=bohemian
```

### Expected Response Format
```json
[
  {
    "id": "track-id",
    "name": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "image": "https://...",
    "uri": "spotify:...",
    "preview_url": "https://...",
    "duration_ms": 240000
  }
]
```

## 🎯 Success Indicators

✅ **Working correctly if:**
1. Searching shows real songs (not just placeholders)
2. Album artwork displays for each song
3. Songs show name, artist, and album
4. Selected songs appear in the correct category
5. Can add/remove songs without issues
6. Sliders work and send values on generate

## 🆘 Need Help?

Check these files for details:
- `INTEGRATION_SUMMARY.md` - Technical implementation
- `ARCHITECTURE_DIAGRAM.md` - System design
- `RECCOBEATS_USER_GUIDE.md` - User-facing guide
- `IMPLEMENTATION_CHECKLIST.md` - What was done

## 📚 File Locations

**Backend:**
- `backend/routes/recco.js` - Search endpoint
- `backend/package.json` - Dependencies (axios added)

**Frontend:**
- `frontend/src/pages/Generate.jsx` - Main page
- `frontend/src/components/SongList/SongList.jsx` - Song display
- `frontend/src/components/SongList/SongList.module.css` - Styling

**Configuration:**
- `backend/.env` - Backend config (port, database, etc.)
- `frontend/.env` - Frontend config (API URL, etc.)

## ✨ Next Steps (Optional)

After verifying everything works:

1. **Add preview audio** - Use `preview_url` field
2. **Save playlists** - Store to MongoDB
3. **User authentication** - Login/signup flow
4. **Search filters** - Filter by genre, year, etc.
5. **Recommendations** - Suggest songs based on favorites

---

**Ready to test?** Start the backend and frontend, then search for your favorite song! 🎵
