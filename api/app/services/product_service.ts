import ResponseService from './response_service.js'
import Category from '#models/cateory'
import Product from '#models/product'
import { CreateProductInput } from '../types/product_interface.js'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import CloudinaryService from './cloudinary_service.js'
import { ListCriteria } from '../types/product_interface.js'
import { ApiResponse } from '../types/response_interface.js'

@inject()
export default class ProductService {
  constructor(
    private responseService: ResponseService,
    private cloudinaryService: CloudinaryService
  ) {}

  async masterList(criteria: ListCriteria): Promise<ApiResponse> {
    try {
      let query = Product.query()

      // Apply price range filter
      const minPrice = criteria.minPrice || 100
      const maxPrice = criteria.maxPrice || 5000
      query.whereBetween('price', [minPrice, maxPrice])

      //Filter by average_rating if provided
      if (criteria.averageRating) {
        query.where('average_rating', '>=', criteria.averageRating)
      }

      //Filter by category slug if provided
      if (criteria.categorySlug) {
        query.whereHas('category', (categoryQuery) => {
          categoryQuery.where('slug', criteria.categorySlug || '')
        })
      }

      // Apply sorting
      switch (criteria.sortBy) {
        case 'price_low_to_high':
          query.orderBy('price', 'asc')
          break
        case 'price_high_to_low':
          query.orderBy('price', 'desc')
          break
        case 'rating':
          query.orderBy('average_rating', 'desc')
          break
        case 'newest_first':
        default:
          query.orderBy('created_at', 'desc')
          break
      }

      return this.responseService.buildSuccess('Products master list fetched successfully.', query)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while fetching products, please try again later.'
      )
    }
  }

  async list(criteria: ListCriteria): Promise<ApiResponse> {
    try {
      const perPage = Math.abs(criteria.perPage || 10)
      const page = Math.abs(criteria.page || 1)

      const masterListResp = await this.masterList(criteria)
      if (masterListResp.status === 'failure') {
        return masterListResp
      }

      const query = masterListResp.data
      const paginated = await query.paginate(page, perPage)
      const serialized = paginated.serialize()

      const _data = {
        records: serialized.data,
        pagination: {
          page: serialized.meta.currentPage,
          perPage: serialized.meta.perPage,
          totalPages: serialized.meta.lastPage,
          totalCount: serialized.meta.total,
        },
      }

      return this.responseService.buildSuccess('Products listed successfully.', _data)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while fetching products, please try again later.'
      )
    }
  }

  // Get all products
  public async getAllProducts(criteria: Partial<ListCriteria>): Promise<ApiResponse> {
    try {
      const parsedCriteria: ListCriteria = {
        page: Number(criteria.page || 1),
        perPage: Number(criteria.perPage || 10),
        sortBy: criteria.sortBy ?? 'newest_first',
        minPrice: Number(criteria.minPrice || 100),
        maxPrice: Number(criteria.maxPrice || 5000),
        averageRating: Number(criteria.averageRating || 0),
        categorySlug: criteria.categorySlug,
      }
  
      const listResponse = await this.list(parsedCriteria)
  
      return listResponse
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to fetch products')
    }
  }
  
  // Create Product
  public async createProduct(
    payload: CreateProductInput,
    image: MultipartFile
  ): Promise<ApiResponse> {
    try {
      const category = await Category.find(payload.category_id)
      if (!category) {
        return this.responseService.buildFailure('Category not found')
      }

      // Upload image to Cloudinary
      const result = await this.cloudinaryService.upload({ tmpPath: image.tmpPath! })

      if (!result.status || !result.url) {
        return this.responseService.buildFailure('Image upload failed')
      }

      const product = await Product.create({
        ...payload,
        thumbnail: result.url,
      })

      return this.responseService.buildSuccess('Product created successfully!', product)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Something went wrong while creating product')
    }
  }

  // Get single product
  public async getProduct(id: number): Promise<ApiResponse> {
    try {
      const product = await Product.query().where('id', id).preload('category').first()
  
      if (!product) {
        return this.responseService.buildFailure('Product not found')
      }
  
      const responseData = this.responseService.buildSuccess(
        'Product fetched successfully',
        product
      )
      return responseData
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to fetch product')
    }
  }
  
  // Update product
  public async updateProduct(
    id: number,
    payload: Partial<any>,
    image?: MultipartFile
  ): Promise<ApiResponse> {
    try {
      const product = await Product.find(id)
  
      if (!product) {
        return this.responseService.buildFailure('Product not found')
      }
  
      // Upload image if provided
      if (image && image.tmpPath) {
        const result = await this.cloudinaryService.upload({ tmpPath: image.tmpPath })
  
        if (!result.status || !result.url) {
          return this.responseService.buildFailure('Image upload failed')
        }
  
        payload.thumbnail = result.url
      }
  
      product.merge(payload)
      await product.save()
  
      return this.responseService.buildSuccess('Product updated successfully', product)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to update product')
    }
  }
  
  // Delete product
  public async deleteProduct(id: number): Promise<ApiResponse> {
    try {
      const product = await Product.find(id)
  
      if (!product) {
        return this.responseService.buildFailure('Product not found')
      }
  
      await product.delete()
  
      return this.responseService.buildSuccess('Product deleted successfully')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to delete product')
    }
  }
  
}
