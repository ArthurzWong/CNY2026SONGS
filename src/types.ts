export interface Song {
  id: string;
  title: string;
  artist: string;
  albumId: string;
  mood: 'Joyful' | 'Nostalgic' | 'Energetic' | 'Traditional' | 'Modern' | 'Celebratory' | 'Lucky' | 'Prosperous';
  duration: number; // in seconds
  price: number;
  coverUrl: string;
  audioUrl: string; // Mock URL
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  price: number;
  songs: string[]; // Array of song IDs
  description: string;
  audioUrl?: string; // Optional audio URL for album preview/play
}

export interface CartItem {
  type: 'song' | 'album';
  item: Song | Album;
}
