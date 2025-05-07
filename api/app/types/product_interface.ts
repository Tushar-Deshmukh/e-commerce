export interface CreateProductInput {
  name: string
  price: number
  category_id: number
  description?: string
}

export interface CreateProductRatingInput {
  product_id: number
  title: string
  comment?: string
  rating: number
  recommended: boolean
}

export interface UpdateProductRatingInput {
  title?: string
  comment?: string
  rating?: number
  recommended?: boolean
}

export interface RatingSummaryInput {
  totalRatings: number
  averageRating: number
  fiveStarCount: number
  fourStarCount: number
  threeStarCount: number
  twoStarCount: number
  oneStarCount: number
}


export interface ListCriteria {
  perPage?: number
  page?: number
  sortBy?: 'newest_first' | 'price_low_to_high' | 'price_high_to_low' | 'rating'
  minPrice?: number
  maxPrice?: number
  averageRating?:number
  categorySlug?:string
}
