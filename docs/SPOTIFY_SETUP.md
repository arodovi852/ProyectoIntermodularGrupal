# Spotify API Integration Setup

## Overview
This project now uses the **Spotify Web API** for searching songs and generating playlists based on audio features.

## Getting Spotify API Credentials

### Step 1: Create a Spotify Developer Account
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account (or create one if needed)

### Step 2: Create an App
1. Click **"Create app"** button
2. Fill in the app information:
   - **App name**: PlayTheMood (or any name you prefer)
   - **App description**: Mood-based playlist generator
   - **Redirect URIs**: `http://localhost:3001/callback` (not used for Client Credentials flow, but required)
   - **APIs used**: Select "Web API"
3. Check the terms of service agreement
4. Click **"Save"**

### Step 3: Get Your Credentials
1. In your app dashboard, click **"Settings"**
2. You'll see:
   - **Client ID** - Copy this
   - **Client Secret** - Click "View client secret" and copy this

### Step 4: Add Credentials to .env File
1. Open `backend/.env`
2. Replace the placeholder values:
   ```env
   SPOTIFY_CLIENT_ID=your_actual_client_id_here
   SPOTIFY_CLIENT_SECRET=your_actual_client_secret_here
   ```

### Step 5: Restart the Backend Server
After adding credentials, restart the backend:
```bash
cd backend
npm run dev
```

## How It Works

### Authentication
- Uses **Client Credentials Flow** (server-to-server authentication)
- Access token is automatically obtained and cached
- Token refreshes automatically when expired (every ~1 hour)

### Search Endpoint
**GET** `/api/recco/search?q={query}`
- Searches Spotify's catalog for tracks
- Returns up to 5 results
- Each result includes: id, name, artist, album, image

### Recommendations Endpoint
**POST** `/api/recco`
- Generates personalized playlists using Spotify's recommendation algorithm
- Parameters: acousticness, danceability, energy, instrumentalness, liveness, loudness, mode, valence, speechiness, tempo
- Uses liked songs as seed tracks (up to 5)
- Returns formatted track data with images

### Get Track Endpoint
**GET** `/api/recco/track/:id`
- Fetches detailed information for a specific track by Spotify ID
- Returns: id, name, artist, album, image, preview_url, duration

## API Documentation References
- [Spotify Search API](https://developer.spotify.com/documentation/web-api/reference/search)
- [Spotify Get Track API](https://developer.spotify.com/documentation/web-api/reference/get-track)
- [Spotify Recommendations API](https://developer.spotify.com/documentation/web-api/reference/get-recommendations)

## Troubleshooting

### "Spotify credentials not configured" Error
- Make sure you've added your Client ID and Client Secret to `.env`
- Restart the backend server after making changes

### "401 Unauthorized" Error
- Check that your credentials are correct
- Verify your app is active in Spotify Dashboard

### No Results from Search
- Make sure your search query is valid
- Check the backend logs for specific error messages

## Rate Limits
- Spotify allows **thousands of requests per day** for free tier
- Current implementation caches access tokens to minimize auth requests
- For production, consider implementing request caching/throttling

## Features Implemented
✅ Search songs by name, artist, or album  
✅ Autocomplete dropdown with 5 results  
✅ Display album artwork, song name, and artist  
✅ Generate playlists based on mood parameters  
✅ Track cards showing image, name, and artist  
✅ Proper error handling and user feedback
