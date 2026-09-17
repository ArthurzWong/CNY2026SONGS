import { loadStripe } from '@stripe/stripe-js';

// Publishable keys are safe to expose in client code.
// Set VITE_STRIPE_PUBLISHABLE_KEY in the environment (e.g. Vercel project settings).
// Falls back to Stripe's public demo test key when not configured.
export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx'
);
