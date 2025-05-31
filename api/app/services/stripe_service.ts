import Stripe from 'stripe'
import env from '#start/env'

class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(env.get('STRIPE_API_KEY'))
  }

  /**
   * Construct webhook event
   */
  constructWebhookEvent(payload: string | Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(payload, signature, env.get('STRIPE_WEBHOOK_SECRET'))
  }

  /**
   * Get Stripe instance for custom operations
   */
  getStripeInstance() {
    return this.stripe
  }

  /**
   * create checkout session
   */

  public async createCheckoutSession(cart: any[], userId: number, amount: number) {
    try {
      // Convert metadata values to strings because it is needed for the stripe, later we can access these values in the webook.
      const cartIds = cart.map((cart) => cart.id)

      const metadata = {
        userId: String(userId),
        cartIds: JSON.stringify(cartIds),
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'Purshase Product',
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${env.get('APP_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.get('APP_URL')}/cancel`,
        metadata,
      })

      return session
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export default new StripeService()
