import React, { useState, useRef } from 'react';
import { ShoppingCart as CartIcon, Music, Search, Upload } from 'lucide-react';
import { Song, Album, CartItem } from './types';
import { songs as initialSongs, albums } from './data/mockData';
import { SongCard } from './components/SongCard';
import { AlbumCard } from './components/AlbumCard';
import { AudioPlayer } from './components/AudioPlayer';
import { Cart } from './components/Cart';
import { PaymentModal } from './components/PaymentModal';
import { DownloadModal } from './components/DownloadModal';
import { GreetingGenerator } from './components/GreetingGenerator';

function App() {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'songs' | 'albums' | 'greetings'>('songs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const songsSectionRef = useRef<HTMLElement>(null);

  const moods = Array.from(new Set(songs.map(s => s.mood)));

  const handleBrowseSongs = () => {
    setActiveTab('songs');
    setTimeout(() => {
      songsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newSong: Song = {
        id: `local-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artist: 'Local Upload',
        albumId: 'local-album',
        mood: 'Modern', // Default mood
        duration: 0, // Unknown duration initially
        price: 0,
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60', // Generic music cover
        audioUrl: URL.createObjectURL(file)
      };
      
      setSongs([newSong, ...songs]);
      // Optional: auto-play the uploaded song
      // setCurrentSong(newSong);
      // setIsPlaying(true);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePlay = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleAlbumPlay = (album: Album) => {
    if (!album.audioUrl) return;
    
    const albumSongId = `album-${album.id}`;
    
    if (currentSong?.id === albumSongId) {
      setIsPlaying(!isPlaying);
    } else {
      const albumSong: Song = {
        id: albumSongId,
        title: album.title,
        artist: album.artist,
        albumId: album.id,
        mood: 'Celebratory',
        duration: 0,
        price: album.price,
        coverUrl: album.coverUrl,
        audioUrl: album.audioUrl
      };
      setCurrentSong(albumSong);
      setIsPlaying(true);
    }
  };

  const handleAddToCart = (item: Song | Album, type: 'song' | 'album') => {
    setCartItems([...cartItems, { type, item }]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPurchasedItems([...cartItems]);
    setCartItems([]);
    setIsPaymentOpen(false);
    setIsDownloadOpen(true);
  };

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMood ? song.mood === selectedMood : true;
    return matchesSearch && matchesMood;
  });

  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cartItems.reduce((sum, item) => sum + item.item.price, 0);

  const isCurrentSongPurchased = currentSong ? purchasedItems.some(p => 
    (p.type === 'song' && p.item.id === currentSong.id) || 
    (p.type === 'album' && (p.item as Album).songs.includes(currentSong.id))
  ) : false;

  return (
    <div 
      className="min-h-screen bg-orange-50 pb-24 font-sans bg-fixed bg-cover bg-center transition-all duration-500"
      style={{ 
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/images/fire-horse-decor.jpg')`
      }}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg sticky top-0 z-40 border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 p-2 rounded-full shadow-md">
              <Music className="h-6 w-6 text-red-700" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-yellow-100 drop-shadow-sm font-serif">
              CNY 2026 Songs
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-red-700 rounded-full transition-colors text-white"
              title="Upload Song"
            >
              <Upload size={24} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-red-700 rounded-full transition-colors"
            >
              <CartIcon size={24} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 transform translate-x-1/4 -translate-y-1/4 bg-yellow-400 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-red-800 text-white overflow-hidden mb-8 shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: "url('/images/fire-horse-hero-v2.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left md:w-2/3 z-10">
            <div className="inline-block px-3 py-1 bg-red-900 bg-opacity-50 rounded-full text-yellow-300 text-sm font-semibold mb-4 border border-yellow-500/30">
              Welcome to the Year of the Horse
            </div>
            <h2 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 drop-shadow-sm">
              Celebrate with Joy
            </h2>
            <p className="mt-5 max-w-xl mx-auto md:mx-0 text-xl text-red-100 leading-relaxed">
              Get ready for 2026 with the best collection of Chinese New Year songs.
              Listen, enjoy, and buy instantly.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <button onClick={handleBrowseSongs} className="px-8 py-3 bg-yellow-500 text-red-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg">
                Browse Songs
              </button>
              <button onClick={() => setActiveTab('greetings')} className="px-8 py-3 bg-red-700 text-white font-bold rounded-lg hover:bg-red-600 transition-colors border border-red-500 shadow-lg">
                Send Greetings
              </button>
            </div>
          </div>
        </div>
      </div>

      <main ref={songsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('songs')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'songs' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Songs
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'albums' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Albums
            </button>
            <button
              onClick={() => setActiveTab('greetings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'greetings' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Greeting Cards
            </button>
          </div>

          {activeTab !== 'greetings' && (
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search songs or albums..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Mood Filters (Only for Songs) */}
        {activeTab === 'songs' && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedMood(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                selectedMood === null 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
              }`}
            >
              All Moods
            </button>
            {moods.map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood === selectedMood ? null : mood)}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  selectedMood === mood
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {activeTab === 'greetings' ? (
          <GreetingGenerator />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === 'songs' ? (
              filteredSongs.map(song => (
                <SongCard
                  key={song.id}
                  song={song}
                  onPlay={handlePlay}
                  onAddToCart={(s) => handleAddToCart(s, 'song')}
                  isPlaying={currentSong?.id === song.id && isPlaying}
                />
              ))
            ) : (
              filteredAlbums.map(album => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onAddToCart={(a) => handleAddToCart(a, 'album')}
                  onPlay={handleAlbumPlay}
                  isPlaying={currentSong?.id === `album-${album.id}` && isPlaying}
                />
              ))
            )}
          </div>
        )}
        
        {activeTab === 'songs' && filteredSongs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No songs found matching your criteria.
          </div>
        )}
         {activeTab === 'albums' && filteredAlbums.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No albums found matching your criteria.
          </div>
        )}
      </main>

      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        isPurchased={isCurrentSongPurchased}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => {
           // Simple next logic
           const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
           const nextSong = songs[(currentIndex + 1) % songs.length];
           setCurrentSong(nextSong);
           setIsPlaying(true);
        }}
        onPrev={() => {
           const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
           const prevSong = songs[(currentIndex - 1 + songs.length) % songs.length];
           setCurrentSong(prevSong);
           setIsPlaying(true);
        }}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={cartTotal}
        onSuccess={handlePaymentSuccess}
      />

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        purchasedItems={purchasedItems}
      />
    </div>
  );
}

export default App;
