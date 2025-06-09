import mongoose from 'mongoose';

const WatchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  symbols: [String],
});

export const Watchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', WatchlistSchema);
