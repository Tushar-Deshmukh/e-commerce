import { HttpContext } from '@adonisjs/core/http'
import RazorpayService from '#services/razorpay_service'
import env from '#start/env'
import crypto from 'crypto'
import ResponseService from '#services/response_service'
import OrderService from '#services/order_service'

export default class RazorpayController {
  private razorpayService = new RazorpayService()
  private responseService = new ResponseService()
  private orderService = new OrderService(this.responseService)

  public async createPaymentLink({ request, response, auth }: HttpContext) {
    try {
      const { amount, cart } = request.only(['amount', 'cart'])
      const userId = auth.user!.id

      if (!amount || !cart) {
        return this.responseService.sendResponse(
          response,
          this.responseService.buildFailure('Amount or Cart is missing'),
          { overrideHttpCode: 404 }
        )
      }

      const result = await this.razorpayService.createPaymentLink(amount, userId, cart)

      return this.responseService.sendResponse(response, result!)
    } catch (error) {
      this.responseService.buildFailure('failed to create order:', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('failed to create order', error)
      )
    }
  }

  public async webhook({ request, response }: HttpContext) {
    try {
      const rawbody = request.raw()!

      // ✅ Signature verification
      const razorpaySignature = request.header('x-razorpay-signature')
      const secret = env.get('RAZORPAY_WEBHOOK_SECRET')

      const expectedSignature = crypto.createHmac('sha256', secret).update(rawbody).digest('hex')

      if (expectedSignature !== razorpaySignature) {
        console.warn('❌ Invalid webhook signature')
        return response.unauthorized('Invalid signature')
      }

      // ✅ Now safely parse and use body
      const body = JSON.parse(rawbody)

      if (body.event === 'payment_link.paid') {
        const paymentLink = body.payload.payment_link.entity
        const notes = paymentLink.notes || {}

        const userId = notes.userId
        const cartIds = notes.cartIds
        const amount = paymentLink.amount / 100

        const result = await this.orderService.createOrder({ userId, cartIds, amount })

        return this.responseService.sendResponse(response, result)
      }
    } catch (error) {
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('error from webhook', error),
        { overrideHttpCode: 500 }
      )
    }
  }
}
