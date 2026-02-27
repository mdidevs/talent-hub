type AppConfig = {
	apiBaseUrl: string;
	stripePublishableKey?: string;
};

const envApiUrl = import.meta.env?.VITE_API_URL;
const resolvedApiUrl = envApiUrl && envApiUrl.trim().length > 0
	? envApiUrl
	: 'http://localhost:3000/api/v1';

const envStripeKey = 'pk_test_51T4Yyp0QQEN2Lnz6SZ5lqXJhpdGQA3no9Em88E6Da7LBYsHFJzPbqEfL2uDzRO6RVUXQjg5EP401lMH4VKtApM7T00DXzw7WMQ';
// const envStripeKey = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY;
const resolvedStripeKey = envStripeKey && envStripeKey.trim().length > 0
	? envStripeKey
	: undefined;

export const appConfig: AppConfig = {
	apiBaseUrl: resolvedApiUrl,
	stripePublishableKey: resolvedStripeKey,
};
