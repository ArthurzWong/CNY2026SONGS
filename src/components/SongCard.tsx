import React from 'react';
import { Play, ShoppingCart } from 'lucide-react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onAddToCart: (song: Song) => void;
  isPlaying: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onPlay, onAddToCart, isPlaying }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-red-50">
      <div className="relative group">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-48 object-cover"
        />
        <div 
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center cursor-pointer"
          onClick={() => onPlay(song)}
        >
          <button 
            className="bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
          >
            <Play fill="currentColor" />
          </button>
        </div>
        {isPlaying && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            Playing
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-900 truncate pr-2">{song.title}</h3>
            <p className="text-sm text-gray-500">{song.artist}</p>
          </div>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-200">
            {song.mood}
          </span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-red-600">MYR {song.price.toFixed(2)}</span>
          <button 
            onClick={() => onAddToCart(song)}
            className="flex items-center space-x-1 text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
          >
            <ShoppingCart size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
