import env from '#start/env'
import Razorpay from 'razorpay'
import ResponseService from './response_service.js'
import { ApiResponse } from '../types/response_interface.js'
import { error } from 'console'

export default class RazorpayService {
  private razorpay: Razorpay
  private responseService = new ResponseService()

  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.get('key_id'),
      key_secret: env.get('key_secret'),
    })
  }

  async createPaymentLink(amount: number, userId: number, cart: any[]): Promise<ApiResponse> {
    try {

      //send the cartIds not the entire cart
      const cartIds = cart.map((item) => item.id)

      const response = await this.razorpay.paymentLink.create({
        amount: amount * 100,
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
        notes: {
          userId: userId,
          cartIds: JSON.stringify(cartIds),
        },
      })

      // Redirect user to this payment link
      return this.responseService.buildSuccess('payment link created successfully!', {
        url: response?.short_url,
      })
    } catch (err) {
      console.error('Failed to create payment link', err)
      return this.responseService.buildFailure('error creating order', error)
    }
  }
}
