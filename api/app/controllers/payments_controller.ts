import stripe from '@vbusatta/adonis-stripe/services/main'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ResponseService from '#services/response_service'

@inject()
export default class PaymentsController {
  constructor(private responseServie: ResponseService) {}

  public async createPaymentIntent({ request, response, auth }: HttpContext) {
    try {
      const { amount, cart } = request.only(['amount', 'cart'])

      const userId = auth.user!.id

      // Validate inputs
      if (!amount || !cart || !Array.isArray(cart)) {
        return response.status(400).json({
          error: 'Invalid input: amount and cart (array) are required',
        })
      }

      // Convert metadata values to strings because it is needed for the stripe, later we can access these values in the webook.
      const cartIds = cart.map((cart) => cart.id)

      const metadata = {
        userId: String(userId),
        cartIds: JSON.stringify(cartIds),
      }

      const stripeInstace = stripe.api

      const session = await stripeInstace.checkout.sessions.create({
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
        success_url: `${request.headers().origin || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers().origin || 'http://localhost:5173'}/cancel`,
        metadata,
      })

      return this.responseServie.sendResponse(
        response,
        this.responseServie.buildSuccess('session created successfully', session.url),
        { overrideHttpCode: 201 }
      )
    } catch (error) {
      console.log('error', error)
      return response.json({ error: error })
    }
  }
}
