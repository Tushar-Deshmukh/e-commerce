import Cart from '../models/cart_item.js'
import Product from '../models/product.js'
import { inject } from '@adonisjs/core'
import ResponseService from '../services/response_service.js'
import { ApiResponse } from '../types/response_interface.js'

@inject()
export default class CartService {
  constructor(private responseService: ResponseService) {}

  public async addToCart(
    userId: number,
    payload: { productId: number; quantity: number; price: number }
  ): Promise<ApiResponse> {
    try {
      const product = await Product.find(payload.productId)

      if (!product) {
        return this.responseService.buildFailure('Product not found')
      }

      let cartItem = await Cart.query()
        .where('user_id', userId)
        .andWhere('product_id', payload.productId)
        .first()

      if (cartItem) {
        cartItem.quantity += payload.quantity
        cartItem.price += payload.price

        await cartItem.save()
      } else {
        cartItem = await Cart.create({
          userId,
          productId: payload.productId,
          quantity: payload.quantity,
          price: payload.price,
        })
      }

      return this.responseService.buildSuccess('Item added to cart successfully', cartItem)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Something went wrong while adding item to cart')
    }
  }

  public async getCartItems(userId: number): Promise<ApiResponse> {
    try {
      const cartItems = await Cart.query()
        .where('user_id', userId)
        .preload('product')
  
      return this.responseService.buildSuccess('Cart items fetched successfully', cartItems)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to fetch cart items')
    }
  }

  public async removeFromCart(cartItemId: number, userId: number): Promise<ApiResponse> {
    try {
      const cartItem = await Cart.query()
        .where('id', cartItemId)
        .andWhere('user_id', userId)
        .first()
  
      if (!cartItem) {
        return this.responseService.buildFailure('Cart item not found or does not belong to the user')
      }
  
      await cartItem.delete()
  
      return this.responseService.buildSuccess('Item removed from cart successfully')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Something went wrong while removing item from cart')
    }
  }
  
}
