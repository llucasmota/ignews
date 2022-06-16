import { loadStripe } from '@stripe/stripe-js'


export async function getStripeJS() {
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY)
  return stripeJs
}