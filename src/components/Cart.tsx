import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.item.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>Your cart is empty.</p>
                <p className="text-sm mt-2">Add some CNY songs!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((cartItem, index) => (
                  <li key={`${cartItem.item.id}-${index}`} className="flex py-2 border-b border-gray-100 last:border-0">
                    <img 
                      src={cartItem.item.coverUrl} 
                      alt={cartItem.item.title} 
                      className="h-16 w-16 rounded object-cover border border-gray-200"
                    />
                    <div className="ml-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{cartItem.item.title}</h3>
                          <p className="ml-4">MYR {cartItem.item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-500 capitalize">{cartItem.type}</p>
                      </div>
                      <div className="flex items-end justify-between text-sm">
                        <p className="text-gray-500">{cartItem.item.artist}</p>
                        <button 
                          onClick={() => onRemoveItem(index)}
                          className="font-medium text-red-600 hover:text-red-500 flex items-center"
                        >
                          <Trash2 size={14} className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>MYR {total.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 mb-4">
              Instant digital delivery — download links are available right after payment.
            </p>
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
