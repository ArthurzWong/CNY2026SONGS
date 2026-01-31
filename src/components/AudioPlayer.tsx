import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Song } from '../types';

interface AudioPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  isPurchased: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  currentSong, 
  isPlaying, 
  isPurchased,
  onPlayPause,
  onNext,
  onPrev
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const PREVIEW_LIMIT = 120; // 2 minutes preview

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const isLocal = currentSong?.id.startsWith('local-');
  const limit = (isLocal || isPurchased) ? duration : PREVIEW_LIMIT;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const currentDuration = audioRef.current.duration;
      
      if (!isNaN(currentDuration)) {
        setDuration(currentDuration);
      }

      if (!isLocal && !isPurchased && currentTime >= PREVIEW_LIMIT) {
        audioRef.current.pause();
        onPlayPause(); // Stop playing
        audioRef.current.currentTime = 0; // Reset
        alert("Preview ended! Buy the song or album to listen to the full version.");
      }
      setProgress(currentTime);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-red-100 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 w-1/3">
          <img 
            src={currentSong.coverUrl} 
            alt={currentSong.title} 
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <h4 className="font-bold text-gray-900 truncate">{currentSong.title}</h4>
            <p className="text-sm text-gray-500 truncate">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center space-x-4 mb-2">
            <button onClick={onPrev} className="text-gray-600 hover:text-red-600">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={onPlayPause} 
              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={onNext} className="text-gray-600 hover:text-red-600">
              <SkipForward size={20} />
            </button>
          </div>
          <div className="w-full flex items-center space-x-2 text-xs text-gray-500">
            <span>{Math.floor(progress)}s</span>
            <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${limit ? (progress / limit) * 100 : 0}%` }}
              />
            </div>
            <span>{(isLocal || isPurchased) ? `${Math.floor(duration)}s` : '120s (Preview)'}</span>
          </div>
        </div>

        <div className="flex items-center justify-end w-1/3 space-x-2">
          <Volume2 size={20} className="text-gray-400" />
          <div className="w-24 h-1 bg-gray-200 rounded-full">
            <div className="w-3/4 h-full bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
      <audio 
        ref={audioRef} 
        src={currentSong.audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => onPlayPause()}
      />
    </div>
  );
};
