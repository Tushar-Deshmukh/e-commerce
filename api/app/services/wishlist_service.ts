import Wishlist from '#models/wishlist'
import ResponseService from './response_service.js'
import { inject } from '@adonisjs/core'
import { ApiResponse } from '../types/response_interface.js'

@inject()
export default class WishlistService {
  constructor(private responseService: ResponseService) {}

  public async toggleWishlist(userId: number, productId: number): Promise<ApiResponse> {
    try {
      const existing = await Wishlist.query()
        .where('user_id', userId)
        .andWhere('product_id', productId)
        .first()

      if (existing) {
        await existing.delete()

        return this.responseService.buildSuccess('Product removed from wishlist', {
          wishlisted: false,
          productId,
        })
      }

      const wishlist = await Wishlist.create({ userId, productId })

      return this.responseService.buildSuccess('Added to wishlist', {
        wishlisted: true,
        productId: wishlist.productId,
        userId: wishlist.userId,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to update wishlist')
    }
  }

  public async removeFromWishlist(userId: number, productId: number): Promise<ApiResponse> {
    try {
      // Check if the wishlist item exists
      const wishlistItem = await Wishlist.query()
        .where('user_id', userId)
        .andWhere('product_id', productId)
        .firstOrFail()

      // Delete the wishlist item
      await wishlistItem.delete()

      // Respond with a success message and updated data
      const responseData = {
        productId,
        wishlisted: false,
      }

      return this.responseService.buildSuccess('Removed from wishlist', responseData)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      // Handle failure to remove the wishlist item
      return this.responseService.buildFailure('Failed to remove from wishlist')
    }
  }

  public async getWishlist(userId: number): Promise<ApiResponse> {
    try {
      const wishlist = await Wishlist.query().where('user_id', userId).preload('product')

      return this.responseService.buildSuccess('Wishlist fetched', wishlist)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to fetch wishlist')
    }
  }

  public async getUserWishlistedProductIds(userId: number) {
    const wishlistedProducts = await Wishlist.query().where('user_id', userId)

    return wishlistedProducts.map((wishlist) => wishlist.productId)
  }

  public async getUserWishlistedIds(userId: number): Promise<ApiResponse> {
    try {
      const productIds = await this.getUserWishlistedProductIds(userId)

      return this.responseService.buildSuccess('Wishlist product IDs fetched', {
        productIds,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to fetch wishlist items')
    }
  }
}
