import env from '#start/env'
import Razorpay from 'razorpay'

export default class RazorpayService {
  private razorpay: Razorpay

  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.get('key_id'),
      key_secret: env.get('key_secret'),
    })
  }

  async createPaymentLink(amount: number) {
    try {
      const response = await this.razorpay.paymentLink.create({
        amount: amount,
        currency: 'INR',
        accept_partial: false,
        description: 'Payment for Order #12345',
        customer: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9123456789',
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
        callback_url: 'http://localhost:5173/success',
        callback_method: 'get',
      })

      // Redirect user to this payment link
      return response
    } catch (err) {
      console.error('Failed to create payment link', err)
    }
  }
}
