import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Song } from '../types';

interface AudioPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  isPurchased: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onBuy: (song: Song) => void;
}

const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSong,
  isPlaying,
  isPurchased,
  onPlayPause,
  onNext,
  onPrev,
  onBuy,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);
  const PREVIEW_LIMIT = 120; // 2 minutes preview

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          /* autoplay rejected; user can press play */
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Reset state when the track changes
  useEffect(() => {
    setPreviewEnded(false);
    setProgress(0);
    setDuration(currentSong?.duration || 0);
  }, [currentSong?.id]);

  const isLocal = currentSong?.id.startsWith('local-');
  const limit = (isLocal || isPurchased) ? duration : PREVIEW_LIMIT;
  const isPreview = !isLocal && !isPurchased;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const currentDuration = audioRef.current.duration;
      if (!isNaN(currentDuration) && isFinite(currentDuration)) {
        setDuration(currentDuration);
      }
      if (isPreview && currentTime >= PREVIEW_LIMIT) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setProgress(0);
        setPreviewEnded(true);
        if (isPlaying) onPlayPause();
        return;
      }
      setProgress(currentTime);
    }
  };

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      setProgress(t);
    }
  }, []);

  const handleMetadata = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (isPlaying) onPlayPause();
    setProgress(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleBuyFromPlayer = () => {
    if (!currentSong) return;
    setPreviewEnded(false);
    onBuy(currentSong);
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-red-100 shadow-lg z-50">
      {previewEnded && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
          Preview ended.{' '}
          <button onClick={handleBuyFromPlayer} className="font-semibold underline hover:text-red-700">
            Add this song to cart to unlock the full version
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 w-1/3 min-w-0">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-gray-900 truncate text-sm">{currentSong.title}</h4>
            <p className="text-xs text-gray-500 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls + seek */}
        <div className="flex flex-col items-center flex-1 max-w-xl">
          <div className="flex items-center gap-4 mb-1.5">
            <button onClick={onPrev} className="text-gray-600 hover:text-red-600 transition-colors" aria-label="Previous song">
              <SkipBack size={20} />
            </button>
            <button
              onClick={onPlayPause}
              className="bg-red-600 text-white p-2.5 rounded-full hover:bg-red-700 transition-colors shadow"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <button onClick={onNext} className="text-gray-600 hover:text-red-600 transition-colors" aria-label="Next song">
              <SkipForward size={20} />
            </button>
          </div>
          <div className="w-full flex items-center gap-2 text-xs text-gray-500 tabular-nums">
            <span>{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={Math.max(limit, 1)}
              step={0.1}
              value={Math.min(progress, limit)}
              onChange={handleSeek}
              className="flex-1 h-1 accent-red-600 cursor-pointer"
              aria-label="Seek"
            />
            <span>{isPreview ? `${formatTime(PREVIEW_LIMIT)} preview` : formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center justify-end gap-2 w-1/3">
          <button
            onClick={() => setMuted(!muted)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setMuted(false);
            }}
            className="w-24 h-1 accent-red-600 cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
};
