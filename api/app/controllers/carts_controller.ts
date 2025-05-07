import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import CartService from '../services/cart_service.js'
import ResponseService from '../services/response_service.js'
import { createCartItemValidator } from '../validators/cart.js'

@inject()
export default class CartController {
  constructor(
    private cartService: CartService,
    private responseService: ResponseService
  ) {}

  public async add({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(createCartItemValidator)
      const userId = auth.user!.id
      const result = await this.cartService.addToCart(userId, payload)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        const responseData = this.responseService.buildFailure(
          'Validation error',
          error.messages[0].message
        )
        return this.responseService.sendResponse(response, responseData, { overrideHttpCode: 422 })
      }

      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while adding to cart')
      )
    }
  }

  public async getCartItems({ response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id
      const result = await this.cartService.getCartItems(userId)
  
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
  
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while fetching cart items'),
        { overrideHttpCode: 500 }
      )
    }
  }
  
}
