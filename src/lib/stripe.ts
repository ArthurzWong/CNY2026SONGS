import { loadStripe } from '@stripe/stripe-js';

// Use a placeholder test key or environment variable
// In a real app, use import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
export const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
