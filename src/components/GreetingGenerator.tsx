import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Type } from 'lucide-react';

export const GreetingGenerator: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState('Gong Xi Fa Cai 2026!');
  const [sender, setSender] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const defaultImages = [
    '/images/fire-horse-hero-v2.jpg', // Main Hero
    '/images/fire-horse-hero.jpg', // Fire Horse 1
    '/images/fire-horse-decor.jpg', // Fire Horse 2
    '/images/cny-dragon.jpg', // Dragon
    '/images/cny-greeting-1.jpg', // Greeting 1
    '/images/cny-greeting-2.jpg', // Greeting 2
    '/images/cny-greeting-3.jpg', // Greeting 3
    '/images/cny-greeting-4.jpg', // Greeting 4
    '/images/cny-greeting-5.jpg', // Greeting 5
    '/images/cny-greeting-6.jpg', // Greeting 6
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedImage;
    img.onload = () => {
      canvas.width = 800;
      canvas.height = 600;

      // Draw image
      ctx.drawImage(img, 0, 0, 800, 600);

      // Add overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, 800, 600);

      // Add border
      ctx.strokeStyle = '#D4AF37'; // Gold
      ctx.lineWidth = 20;
      ctx.strokeRect(20, 20, 760, 560);

      // Add text
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      
      // Message
      ctx.font = 'bold 48px serif';
      ctx.fillText(message, 400, 300);

      // Sender
      if (sender) {
        ctx.font = 'italic 32px serif';
        ctx.fillText(`From: ${sender}`, 400, 380);
      }

      // Year
      ctx.font = '24px sans-serif';
      ctx.fillText('Year of the Horse 2026', 400, 500);

      // Download
      const link = document.createElement('a');
      link.download = 'cny-greeting-2026.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-800 mb-2">Create Your CNY Greeting Card</h2>
        <p className="text-gray-600">Choose an image or upload your own, add a message, and download!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. Select Background
            </label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {defaultImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative rounded-lg overflow-hidden h-20 border-2 transition-all ${
                    selectedImage === img ? 'border-red-600 ring-2 ring-red-200' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="Template" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Your Photo
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. Customize Message
            </label>
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter greeting message..."
                />
              </div>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="From (Optional)..."
              />
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={!selectedImage}
            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm transition-colors ${
              selectedImage 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Card
          </button>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
          {selectedImage ? (
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg group">
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center p-6 text-center border-[16px] border-yellow-500 m-4">
                <h3 className="text-white text-3xl font-serif font-bold mb-4 drop-shadow-lg break-words w-full">
                  {message}
                </h3>
                {sender && (
                  <p className="text-white text-xl font-serif italic drop-shadow-md">
                    From: {sender}
                  </p>
                )}
                <p className="absolute bottom-4 text-white/80 text-sm">
                  Year of the Horse 2026
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <ImageIcon className="mx-auto h-12 w-12 mb-2" />
              <p>Select an image to preview</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden canvas for downloading */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
