import React, { useState } from 'react';
import { X, CheckCircle, Loader } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import { StripePaymentForm } from './StripePaymentForm';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showTngQr, setShowTngQr] = useState(false);
  const [, setPaymentMethod] = useState<'stripe' | 'tng' | null>(null);
  const [transactionId, setTransactionId] = useState('');

  const handleTngPayment = () => {
    setPaymentMethod('tng');
    setShowTngQr(true);
    setTransactionId('');
  };

  const confirmTngPayment = () => {
    if (transactionId.length < 6) return; // Basic validation
    
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      setShowTngQr(false);
      handleSuccess();
    }, 2000);
  };

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      onSuccess();
      setSuccess(false);
      setPaymentMethod(null);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {success ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Successful!</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Thank you for your purchase. Your songs are ready to download.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex justify-between items-center">
                    {showTngQr ? 'Scan to Pay' : 'Payment'}
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                      <X size={20} />
                    </button>
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Total Amount: <span className="font-bold text-gray-900 text-lg">MYR {total.toFixed(2)}</span>
                    </p>
                    
                    {showTngQr ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white p-2 border rounded-lg shadow-sm">
                          <img 
                            src="/images/tng-qr.png" 
                            alt="Touch 'n Go QR Code" 
                            className="w-full max-w-[240px] max-h-[400px] h-auto object-contain mx-auto"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "https://placehold.co/256x380/red/white?text=QR+Code+Missing";
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          Scan this QR code with your Touch 'n Go eWallet app.<br/>
                          After payment, enter your Transaction ID below.
                        </p>
                        
                        <div className="w-full">
                          <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                            Transaction Reference No.
                          </label>
                          <input
                            type="text"
                            id="transactionId"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="e.g. 240212123456"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Found on your payment receipt
                          </p>
                        </div>

                        <div className="w-full space-y-2">
                          <button
                            onClick={confirmTngPayment}
                            disabled={loading || transactionId.length < 6}
                            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                              loading || transactionId.length < 6 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {loading ? (
                              <>
                                <Loader className="animate-spin h-5 w-5 mr-2" />
                                Verifying...
                              </>
                            ) : (
                              "Verify Payment"
                            )}
                          </button>
                          <button
                            onClick={() => setShowTngQr(false)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Stripe Payment Section */}
                        <div className="border border-indigo-100 rounded-lg p-4 bg-indigo-50/50">
                           <h4 className="font-medium text-indigo-900 mb-3 flex items-center">
                             <span className="font-bold mr-2">Credit Card</span> (Stripe)
                           </h4>
                           <Elements stripe={stripePromise}>
                              <StripePaymentForm amount={total} onSuccess={handleSuccess} />
                           </Elements>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-2 bg-white text-sm text-gray-500">Or pay with eWallet</span>
                          </div>
                        </div>

                        <button
                          onClick={handleTngPayment}
                          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <div className="flex items-center">
                            <span className="font-bold mr-2">Touch 'n Go</span> eWallet
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
