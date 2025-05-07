import type { HttpContext } from '@adonisjs/core/http'
import WishlistService from '#services/wishlist_service'
import { inject } from '@adonisjs/core'
import { createWishlistValidator } from '#validators/ratings'
import ResponseService from '#services/response_service'

@inject()
export default class WishlistController {
  constructor(
    private wishlistService: WishlistService,
    private responseService: ResponseService
  ) {}

  public async add({ request, response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id
      const { product_id } = await request.validateUsing(createWishlistValidator)

      const result = await this.wishlistService.toggleWishlist(userId, product_id)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while updating wishlist'),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async remove({ response, auth, params }: HttpContext) {
    try {
      const userId = auth.user!.id
      const productId = Number(params.productId)

      const result = await this.wishlistService.removeFromWishlist(userId, productId)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Failed to remove from wishlist'),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async list({ response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id
      const result = await this.wishlistService.getWishlist(userId)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while fetching wishlist'),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async wishlistedProducts({ response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id
      const result = await this.wishlistService.getUserWishlistedIds(userId)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while fetching wishlisted products'
        ),
        { overrideHttpCode: 500 }
      )
    }
  }
}
