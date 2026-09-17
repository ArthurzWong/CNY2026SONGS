import React from 'react';
import { X, Download, Music, Disc } from 'lucide-react';
import { Song, Album, CartItem } from '../types';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedItems: CartItem[];
  allSongs: Song[];
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, purchasedItems, allSongs }) => {
  if (!isOpen) return null;

  const songsById = new Map(allSongs.map((s) => [s.id, s]));

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex justify-between items-center">
                  Your Downloads
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X size={20} />
                  </button>
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Thank you for your purchase! You can download your songs below.
                  </p>

                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {purchasedItems.map((item, index) => (
                      <div key={`${item.type}-${item.item.id}-${index}`} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {item.type === 'song' ? (
                              <div className="bg-red-100 p-2 rounded-full">
                                <Music size={16} className="text-red-600" />
                              </div>
                            ) : (
                              <div className="bg-yellow-100 p-2 rounded-full">
                                <Disc size={16} className="text-yellow-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.item.title}</p>
                              <p className="text-xs text-gray-500">{item.item.artist}</p>
                            </div>
                          </div>

                          {item.type === 'song' ? (
                            <a
                              href={(item.item as Song).audioUrl}
                              download={`${item.item.title}.mp3`}
                              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-green-700 transition-colors"
                            >
                              <Download size={14} />
                              <span>Download</span>
                            </a>
                          ) : (
                            <div className="text-xs text-gray-500 italic">
                              {(item.item as Album).songs.length} songs included
                            </div>
                          )}
                        </div>

                        {item.type === 'album' && (
                          <div className="mt-2 pl-11 space-y-2 max-h-48 overflow-y-auto">
                            {(item.item as Album).songs
                              .map((id) => songsById.get(id))
                              .filter((s): s is Song => Boolean(s))
                              .map((song) => (
                                <div key={song.id} className="flex items-center justify-between bg-white border border-gray-200 rounded px-2 py-1.5">
                                  <span className="text-xs text-gray-700 truncate pr-2">{song.title}</span>
                                  <a
                                    href={song.audioUrl}
                                    download={`${song.title}.mp3`}
                                    className="flex items-center flex-shrink-0 text-xs text-green-700 hover:text-green-800 font-medium"
                                  >
                                    <Download size={12} className="mr-1" />
                                    Save
                                  </a>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
