import React from 'react';
import { ShoppingCart, Disc, Play, Pause } from 'lucide-react';
import { Album } from '../types';

interface AlbumCardProps {
  album: Album;
  onAddToCart: (album: Album) => void;
  onPlay?: (album: Album) => void;
  isPlaying?: boolean;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onAddToCart, onPlay, isPlaying }) => {
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-yellow-100">
      <div className="relative">
        <img 
          src={album.coverUrl} 
          alt={album.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center z-10">
          <Disc size={12} className="mr-1" />
          ALBUM
        </div>
        
        {/* Play Overlay */}
        {album.audioUrl && (
          <div 
            className={`absolute inset-0 bg-black transition-all duration-300 flex items-center justify-center cursor-pointer ${
              isPlaying ? 'bg-opacity-40' : 'bg-opacity-0 group-hover:bg-opacity-40'
            }`}
            onClick={() => onPlay && onPlay(album)}
          >
            <button 
              className={`bg-red-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                isPlaying 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0'
              }`}
            >
              {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-900 truncate">{album.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{album.artist}</p>
        <p className="text-xs text-gray-400 mb-4 line-clamp-2">{album.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-red-600">MYR {album.price.toFixed(2)}</span>
          <button 
            onClick={() => onAddToCart(album)}
            className="flex items-center space-x-1 text-sm bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition-colors"
          >
            <ShoppingCart size={16} />
            <span>Add Album</span>
          </button>
        </div>
      </div>
    </div>
  );
};
