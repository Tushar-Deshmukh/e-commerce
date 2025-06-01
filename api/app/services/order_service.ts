import Order from '#models/order'
import { inject } from '@adonisjs/core'
import ResponseService from './response_service.js'
import { ApiResponse } from '../types/response_interface.js'
import Cart from '#models/cart_item'
import OrderItem from '#models/order_item'

interface CreateOrderPayload {
  userId: string
  cartIds: string[]
  amount: number
}

@inject()
export default class OrderService {
  constructor(private responseService: ResponseService) {}

  public async createOrder({ userId, cartIds, amount }: CreateOrderPayload): Promise<ApiResponse> {
    try {
      // const parsedCartIds = typeof cartIds === 'string' ? JSON.parse(cartIds) : cartIds

      // if (!parsedCartIds || parsedCartIds.length === 0) {
      //   return this.responseService.buildFailure('Cart is empty or invalid')
      // }

      // const normalizedCartIds = JSON.stringify([...parsedCartIds].sort())

      // const existingOrder = await Order.query()
      //   .where('user_id', userId)
      //   .andWhereRaw('cart_items = ?', [normalizedCartIds])
      //   .first()

      // console.log('exisiting', existingOrder)

      // if (existingOrder) {
      //   console.log('Order already exists')
      //   return this.responseService.buildSuccess('Order already exists', existingOrder)
      // }

      let parsedCartIds = typeof cartIds === 'string' ? JSON.parse(cartIds) : cartIds

      parsedCartIds = parsedCartIds
        .filter((id: any) => id !== null && id !== undefined)
        .map((id: any) => Number(id))
        .sort((a: number, b: number) => a - b)

      if (!parsedCartIds.length) {
        return this.responseService.buildFailure('Invalid or empty cart IDs')
      }

      const normalizedCartIds = JSON.stringify(parsedCartIds)

      const existingOrder = await Order.query()
        .where('user_id', userId)
        .andWhereRaw('cart_items = ?', [normalizedCartIds])
        .first()

      if (existingOrder) {
        return this.responseService.buildSuccess('Order already exists', existingOrder)
      }

      // Step 1: Fetch cart items with product info
      const cartItems = await Cart.query()
        .whereIn('id', parsedCartIds)
        .andWhere('user_id', userId)
        .preload('product') // optional if you want product info later

      // Step 2: Create the order
      const order = await Order.create({
        userId,
        cartItems: parsedCartIds, // store just the cart IDs for reference
        amount,
        status: 'placed',
      })

      // Step 3: Create snapshot in order_items
      for (const item of cartItems) {
        await OrderItem.create({
          orderId: order.id,
          userId: Number(userId),
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })
      }

      if (cartItems.length === 0) {
        return this.responseService.buildFailure('No valid cart items found')
      }

      // Step 4: Delete cart items
      await Cart.query().whereIn('id', parsedCartIds).andWhere('user_id', userId).delete()

      return this.responseService.buildSuccess('Order created successfully', order)
    } catch (error) {
      console.error('Order creation failed:', error)
      return this.responseService.buildFailure('Failed to create order', error)
    }
  }

  public async getOrdersByUser(userId: number): Promise<ApiResponse> {
    try {
      // Fetch all orders for the user
      const orders = await OrderItem.query().where('user_id', userId).preload('product')

      return this.responseService.buildSuccess('Orders fetched successfully', orders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      return this.responseService.buildFailure('Failed to fetch orders', error)
    }
  }

  public async deleteUserOrderById(userId: number, orderId: number) {
    try {
      // Step 1: Check if the order exists and belongs to the user
      const orderitem = await OrderItem.query()
        .where('id', orderId)
        .andWhere('user_id', userId)
        .first()

      if (!orderitem) {
        return this.responseService.buildFailure('Order not found for this user')
      }

      await Order.query().where('id', orderitem.orderId).andWhere('userId', userId).delete()

      await orderitem.delete()

      return this.responseService.buildSuccess('Order cancelled successfully!')
    } catch (error) {
      console.error('Error deleting order:', error)
      return this.responseService.buildFailure('Failed to delete the order', error)
    }
  }
}
