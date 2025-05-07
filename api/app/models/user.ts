import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'
import Token from './token.js'
import ProductRating from './product_rating.js'
import Wishlist from './wishlist.js'
import CartItem from './cart_item.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare first_name: string | null

  @column()
  declare last_name: string | null

  @column()
  declare email: string

  @column()
  declare phone_number: string | null

  @column()
  declare brand: string | null

  @column()
  declare business: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare isVerified:boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  declare roles: ManyToMany<typeof Role>

  @hasMany(() => Token, {
    foreignKey: 'tokenable_id',
    localKey: 'id',
  })
  declare tokens: HasMany<typeof Token>

  @hasMany(() => ProductRating)
  declare ratings: HasMany<typeof ProductRating>

  @hasMany(() => Wishlist)
  declare wishlists: HasMany<typeof Wishlist>

  @hasMany(() => CartItem)
  declare cartItems: HasMany<typeof CartItem>
}
