import Order from '#models/order'
import { inject } from '@adonisjs/core'
import ResponseService from './response_service.js'
import { ApiResponse } from '../types/response_interface.js'

interface CreateOrderPayload {
  userId: string | undefined
  cartIds: string[]
  amount: number
}

@inject()
export default class OrderService {
  constructor(private responseService: ResponseService) {}

  public async createOrder({
    userId,
    cartIds,
    amount,
  }: CreateOrderPayload): Promise<ApiResponse> {
    try {
      const order = await Order.create({
        userId,
        cartItems: cartIds,
        amount,
        status: 'placed',
      })

      return this.responseService.buildSuccess('Order created successfully', order)
    } catch (error) {
      console.error('Order creation failed:', error)
      return this.responseService.buildFailure('Failed to create order', error)
    }
  }
}
