import type { HttpContext } from '@adonisjs/core/http'
import CategoryService from '#services/category_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import { createCategoryValidator } from '#validators/category'

@inject()
export default class CategoriesController {
  constructor(
    private responseService: ResponseService,
    private categoryService: CategoryService
  ) {}

  public async create({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createCategoryValidator)
      const result = await this.categoryService.createCategory(payload)

      return this.responseService.sendResponse(response, result, {
        overrideHttpCode: result.status === 'success' ? 201 : 409,
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        const errorResponse = this.responseService.buildFailure('Validation Error', error.messages)
        return this.responseService.sendResponse(response, errorResponse, { overrideHttpCode: 422 })
      }

      this.responseService.buildLogger('error', error)

      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while creating category'),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async index({ response }: HttpContext) {
    try {
      const result = await this.categoryService.getAllCategories()
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
  
      const failureResponse = this.responseService.buildFailure(
        'Something went wrong while fetching categories'
      )
      return this.responseService.sendResponse(response, failureResponse, {
        overrideHttpCode: 500,
      })
    }
  }
  

  public async show({ params, response }: HttpContext) {
    try {
      const result = await this.categoryService.getCategory(params.id)
      return this.responseService.sendResponse(response, result, {
        overrideHttpCode: result.status === 'success' ? 200 : 404,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)
  
      const failureResponse = this.responseService.buildFailure(
        'Something went wrong while fetching category',
        { respCode: 500 }
      )
      return this.responseService.sendResponse(response, failureResponse, {
        overrideHttpCode: 500,
      })
    }
  }
  
  public async update({ request, response, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(createCategoryValidator)
      const result = await this.categoryService.updateCategory(params.id, payload)
  
      return this.responseService.sendResponse(response, result, {
        overrideHttpCode: result.status === 'success' ? 200 : 404,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)
  
      const failureResponse = this.responseService.buildFailure(
        'Something went wrong while updating category'
      )
      return this.responseService.sendResponse(response, failureResponse, {
        overrideHttpCode: 500,
      })
    }
  }
  

  public async destroy({ response, params }: HttpContext) {
    try {
      const result = await this.categoryService.deleteCategory(params.id)
  
      return this.responseService.sendResponse(response, result, {
        overrideHttpCode: result.status === 'success' ? 200 : 404,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)
  
      const failureResponse = this.responseService.buildFailure(
        'Something went wrong while deleting category'
      )
      return this.responseService.sendResponse(response, failureResponse, {
        overrideHttpCode: 500,
      })
    }
  }
}
