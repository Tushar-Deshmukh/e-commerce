import ProductRating from '#models/product_rating'
import { inject } from '@adonisjs/core'
import ResponseService from './response_service.js'
import { CreateProductRatingInput, UpdateProductRatingInput } from 
'../types/product_interface.js'
import Product from '#models/product'
import { buildRatingSummary } from '../helpers/index.js'
import { ApiResponse } from '../types/response_interface.js'

@inject()
export default class RatingService {
  constructor(private responseService: ResponseService) {}

  public async create(userId: number, payload: CreateProductRatingInput): Promise<ApiResponse> {
    try {
      const existingRating = await ProductRating.query()
        .where('user_id', userId)
        .andWhere('product_id', payload.product_id)
        .first()

      if (existingRating) {
        existingRating.merge(payload)
        await existingRating.save()

        await this.updateProductRatingSummary(payload.product_id)

        return this.responseService.buildSuccess('Rating updated', existingRating)
      }

      const rating = await ProductRating.create({ ...payload, userId })

      await this.updateProductRatingSummary(payload.product_id)

      return this.responseService.buildSuccess('Rating submitted!', rating)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to submit or update rating')
    }
  }

  public async update(
    userId: number,
    ratingId: number,
    payload: UpdateProductRatingInput
  ): Promise<ApiResponse> {
    try {
      const rating = await ProductRating.query()
        .where('id', ratingId)
        .andWhere('user_id', userId)
        .first()

      if (!rating) {
        return this.responseService.buildFailure('Rating not found or access denied', null)
      }

      rating.merge(payload)
      await rating.save()

      await this.updateProductRatingSummary(rating.productId)

      return this.responseService.buildSuccess('Rating updated successfully', rating)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to update rating')
    }
  }

  public async delete(userId: number, ratingId: number): Promise<ApiResponse> {
    try {
      const rating = await ProductRating.query()
        .where('id', ratingId)
        .andWhere('user_id', userId)
        .first()

      if (!rating) {
        return this.responseService.buildFailure('Rating not found or access denied')
      }

      await rating.delete()

      await this.updateProductRatingSummary(rating.productId)

      return this.responseService.buildSuccess('Rating deleted successfully')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to delete rating')
    }
  }

  public async getRatingsByProduct(productId: number): Promise<ApiResponse> {
    try {
      const [product, ratings] = await Promise.all([
        Product.findOrFail(productId),
        ProductRating.query().where('product_id', productId).preload('user'),
      ])
  
      const summary = buildRatingSummary({
        totalRatings: product.totalRatings,
        averageRating: product.averageRating,
        fiveStarCount: product.fiveStarCount,
        fourStarCount: product.fourStarCount,
        threeStarCount: product.threeStarCount,
        twoStarCount: product.twoStarCount,
        oneStarCount: product.oneStarCount,
      })
  
      return this.responseService.buildSuccess('Product ratings fetched', {
        ratings,
        summary,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to fetch ratings')
    }
  }
  
  private async updateProductRatingSummary(productId: number) {
    const ratings = await ProductRating.query().where('product_id', productId)

    const total = ratings.length
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0)

    const stars = {
      five: ratings.filter((r) => r.rating === 5).length,
      four: ratings.filter((r) => r.rating === 4).length,
      three: ratings.filter((r) => r.rating === 3).length,
      two: ratings.filter((r) => r.rating === 2).length,
      one: ratings.filter((r) => r.rating === 1).length,
    }

    const average = total ? sum / total : 0

    await Product.query().where('id', productId).update({
      average_rating: average,
      total_ratings: total,
      five_star_count: stars.five,
      four_star_count: stars.four,
      three_star_count: stars.three,
      two_star_count: stars.two,
      one_star_count: stars.one,
    })
  }
}
