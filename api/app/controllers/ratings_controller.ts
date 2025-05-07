import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import RatingService from '#services/rating_service'
import { createRatingValidator, updateRatingValidator } from '#validators/ratings'
import ResponseService from '#services/response_service'

@inject()
export default class RatingsController {
  constructor(
    private ratingService: RatingService,
    private responseService: ResponseService
  ) {}

  public async create({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(createRatingValidator)
      const userId = auth.user!.id

      const result = await this.ratingService.create(userId, payload)

      return this.responseService.sendResponse(response, result, {
        overrideHttpCode: result.status === 'success' ? 201 : 400,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while submitting rating'),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async update({ request, response, auth, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateRatingValidator)
      const userId = auth.user!.id
      const ratingId = Number(params.id)

      const result = await this.ratingService.update(userId, ratingId, payload)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while updating rating'),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async delete({ response, auth, params }: HttpContext) {
    try {
      const userId = auth.user!.id
      const ratingId = Number(params.id)

      const result = await this.ratingService.delete(userId, ratingId)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while deleting rating'),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async getProductRatings({ response, params }: HttpContext) {
    try {
      const productId = Number(params.productId)
      const result = await this.ratingService.getRatingsByProduct(productId)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while fetching ratings'),
        { overrideHttpCode: 500 }
      )
    }
  }
}
