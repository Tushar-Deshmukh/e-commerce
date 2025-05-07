import ResponseService from './response_service.js'
import { CreateCategoryInput } from '../types/category_interface.js'
import Category from '#models/cateory'
import { inject } from '@adonisjs/core'
import { ApiResponse } from '../types/response_interface.js'

@inject()
export default class CategoryService {
  constructor(private responseService: ResponseService) {}

  public async createCategory(payload: CreateCategoryInput): Promise<ApiResponse> {
    try {
      const existingCategory = await Category.query()
        .where('name', payload.name)
        .orWhere('slug', payload.slug)
        .first()

      if (existingCategory) {
        return this.responseService.buildFailure('Category already exists')
      }

      const newCategory = await Category.create(payload)

      return this.responseService.buildSuccess('Category created successfully!', {
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        slug: newCategory.slug,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Something went wrong while creating category', {
        respCode: 500,
      })
    }
  }

  // Get All Categories
  public async getAllCategories(): Promise<ApiResponse> {
    try {
      const categories = await Category.all()

      return this.responseService.buildSuccess('Categories fetched successfully', categories)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.buildFailure(
        'Failed to fetch categories. Please try again later.',
        { respCode: 500 }
      )
    }
  }

  public async getCategory(id: number): Promise<ApiResponse> {
    try {
      if (!id || isNaN(id)) {
        return this.responseService.buildFailure('Invalid category ID provided')
      }

      const category = await Category.find(id)

      if (!category) {
        return this.responseService.buildFailure('Category not found')
      }

      return this.responseService.buildSuccess('Category fetched successfully', category)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      return this.responseService.buildFailure('Failed to fetch category. Please try again later.')
    }
  }

  // Update Category
  public async updateCategory(
    id: number,
    payload: Partial<CreateCategoryInput>
  ): Promise<ApiResponse> {
    try {
      if (!id || isNaN(id)) {
        return this.responseService.buildFailure('Invalid category ID provided')
      }

      const category = await Category.find(id)

      if (!category) {
        return this.responseService.buildFailure('Category not found')
      }

      category.merge(payload)
      await category.save()

      return this.responseService.buildSuccess('Category updated successfully', category)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Something went wrong while updating category')
    }
  }

  // Delete Category
  public async deleteCategory(id: number): Promise<ApiResponse> {
    try {
      if (!id || isNaN(id)) {
        return this.responseService.buildFailure('Invalid category ID provided')
      }

      const category = await Category.find(id)

      if (!category) {
        return this.responseService.buildFailure('Category not found')
      }

      await category.delete()

      return this.responseService.buildSuccess('Category deleted successfully')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Something went wrong while deleting category')
    }
  }
}
