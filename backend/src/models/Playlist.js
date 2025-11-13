import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  mood: String,
  tracks: Array,
  createdAt: {
    type: Date,
    default: Date.now
    }
});

export default mongoose.model('Playlist', PlaylistSchema);