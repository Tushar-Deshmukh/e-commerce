import { HttpContext } from '@adonisjs/core/http'
import RazorpayService from '#services/razorpay_service'
import env from '#start/env'
import crypto from 'crypto'

export default class RazorpayController {
  private razorpayService = new RazorpayService()

  public async createPaymentLink({ request, response,auth }: HttpContext) {
    try {
      const { amount,cart } = request.only(['amount','cart']);
      const userId = auth.user!.id

      const result = await this.razorpayService.createPaymentLink(amount)

      return response.json({
        success: true,
        url: result?.short_url,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error.message,
      })
    }
  }

  public async webhook({ request, response }: HttpContext) {
   
    const rawbody = request.raw()!
    // ✅ Signature verification
    const razorpaySignature = request.header('x-razorpay-signature')
    const secret = env.get('RAZORPAY_WEBHOOK_SECRET')

    const expectedSignature = crypto.createHmac('sha256', secret).update(rawbody).digest('hex')

    console.log(
      'expected signature and razorpaysignature',
      `${expectedSignature} : ${razorpaySignature}`
    )

    if (expectedSignature !== razorpaySignature) {
      console.warn('❌ Invalid webhook signature')
      return response.unauthorized('Invalid signature')
    }

    // ✅ Now safely parse and use body
    const body = JSON.parse(rawbody)
    console.log('Parsed body:', body.payload)

    if (body.event === 'payment_link.paid') {
      const paymentLink = body.payload.payment_link.entity
      const paymentId = paymentLink.payment_id

      console.log('✅ Payment verified from webhook:', paymentId)

      // await OrderService.create(...)
    }

    return response.ok({})
  }
}
