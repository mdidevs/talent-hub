import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { appConfig } from '@/configs/app.config';

export const stripePromise: Promise<Stripe | null> = appConfig.stripePublishableKey
  ? loadStripe(appConfig.stripePublishableKey)
  : Promise.resolve(null);
