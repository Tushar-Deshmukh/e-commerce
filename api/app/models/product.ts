import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from './cateory.js'
import ProductRating from './product_rating.js'
import Wishlist from './wishlist.js'
import CartItem from './cart_item.js'
import { DateTime } from 'luxon'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare thumbnail: string

  @column()
  declare categoryId: number

  @column()
  declare averageRating: number

  @column()
  declare totalRatings: number

  @column()
  declare fiveStarCount: number

  @column()
  declare fourStarCount: number

  @column()
  declare threeStarCount: number

  @column()
  declare twoStarCount: number

  @column()
  declare oneStarCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => ProductRating)
  declare ratings: HasMany<typeof ProductRating>

  @hasMany(() => Wishlist)
  declare wishlists: HasMany<typeof Wishlist>

  @hasMany(() => CartItem)
  declare cartItems: HasMany<typeof CartItem>
}
