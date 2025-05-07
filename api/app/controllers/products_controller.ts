import type { HttpContext } from '@adonisjs/core/http'
import ResponseService from '#services/response_service'
import ProductService from '#services/product_service'
import { createProductValidator } from '#validators/products'
import { inject } from '@adonisjs/core'

@inject()
export default class ProductsController {
  constructor(
    private responseService: ResponseService,
    private productService: ProductService
  ) {}

  public async create({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createProductValidator)

      const image = request.file('image', {
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
        size: '2mb',
      })

      if (!image?.isValid) {
        return this.responseService.sendResponse(
          response,
          this.responseService.buildFailure('Invalid image upload', image?.errors),
          { overrideHttpCode: 422 }
        )
      }

      if (!image || !image.tmpPath) {
        return this.responseService.sendResponse(
          response,
          this.responseService.buildFailure('Product image is required'),
          { overrideHttpCode: 400 }
        )
      }

      const result = await this.productService.createProduct(payload, image)

      return this.responseService.sendResponse(response, result, {
        overrideHttpCode: result.status === 'success' ? 201 : 400,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)

      if (error.code === 'E_VALIDATION_ERROR') {
        const errorResponse = this.responseService.buildFailure('Validation error', error.messages)
        return this.responseService.sendResponse(response, errorResponse, {
          overrideHttpCode: 422,
        })
      }

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while creating product'),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async index({ request, response }: HttpContext) {
    try {
      const criteria = request.all()
      const result = await this.productService.getAllProducts(criteria)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while fetching products'),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const result = await this.productService.getProduct(params.id)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
  
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while fetching product'),
        { overrideHttpCode: 500 }
      )
    }
  }
  
  public async update({ request, params, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createProductValidator)
  
      const image = request.file('image', {
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
        size: '2mb',
      })
  
      if (image && !image.isValid) {
        return response.badRequest({ errors: image.errors })
      }
  
      const result = await this.productService.updateProduct(params.id, payload, image ?? undefined)
  
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
  
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while updating product'),
        { overrideHttpCode: 500 }
      )
    }
  }
  
  public async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.productService.deleteProduct(params.id)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
  
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while deleting product'),
        { overrideHttpCode: 500 }
      )
    }
  }
  
}
