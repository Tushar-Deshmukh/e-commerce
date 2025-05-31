import { HttpContext } from '@adonisjs/core/http'
import ResponseService from '#services/response_service'
import StripeService from '#services/stripe_service'
import { inject } from '@adonisjs/core'

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

      const result = await StripeService.createCheckoutSession(cart, userId, amount)

      return this.responseServie.sendResponse(
        response,
        this.responseServie.buildSuccess('session created successfully', result?.url),
        { overrideHttpCode: 201 }
      )
    } catch (error) {
      console.log('error', error)
      return response.json({ error: error })
    }
  }


   async stripe({ request, response }: HttpContext) {
      console.log('✅ Webhook hit received')
  
      try {
        const signature = request.header('stripe-signature')
  
        console.log('signature:', signature)
  
        const event = StripeService.constructWebhookEvent(request.raw()!, signature!)
  
        console.log('Received event:', event.type)
  
        switch (event.type) {
          case 'checkout.session.completed':
            await this.handleCheckoutSessionCompleted(event.data.object)
            break
  
          default:
            console.log(`Unhandled event type ${event.type}`)
        }
  
        response.json({ received: true })
      } catch (error) {
        console.error('Webhook error:', error.message)
        response.status(400).json({ error: error.message })
      }
    }
  
    private async handleCheckoutSessionCompleted(session: any) {
      console.log('Checkout session completed:', session.id)
  
      // Extract metadata
      const { userId, cartIds } = session.metadata
      const parsedCartIds = JSON.parse(cartIds)
  
      console.log('User ID:', userId)
      console.log('Cart IDs:', parsedCartIds)
      console.log('Amount Total:', session.amount_total)
      console.log('Payment Status:', session.payment_status)
  
      // Add your business logic here
      // For example:
      // - Update order status in database
      // - Clear user's cart
      // - Send confirmation email
      // - Update inventory
  
      try {
        console.log('Payment processing completed successfully')
      } catch (error) {
        console.error('Error processing successful payment:', error)
      }
    }
}
