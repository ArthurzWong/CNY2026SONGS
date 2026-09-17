import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      // Create a PaymentMethod using the card element
      // This is the client-side part of the transaction.
      // In a real application, you would send this paymentMethod.id to your backend
      // to create a Charge or PaymentIntent.
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message || 'An error occurred');
        setProcessing(false);
      } else {
        console.log('[PaymentMethod]', paymentMethod);
        // Simulate backend processing time
        setTimeout(() => {
          setProcessing(false);
          onSuccess();
        }, 1500);
      }
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
          <CardElement options={cardStyle} />
        </div>
      </div>
      
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
      >
        <Lock className="w-4 h-4 mr-2" />
        {processing ? 'Processing...' : `Pay MYR ${amount.toFixed(2)}`}
      </button>
      
      <p className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center">
        <Lock className="w-3 h-3 mr-1" />
        Payments are secure and encrypted
      </p>
    </form>
  );
};
