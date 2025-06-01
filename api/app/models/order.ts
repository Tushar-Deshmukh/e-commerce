import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { hasMany } from '@adonisjs/lucid/orm'
import OrderItem from './order_item.js'

  export default class Order extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare userId: string

    @column({
      consume: (value) => JSON.parse(value),
      prepare: (value) => JSON.stringify(value),
      columnName:'cart_items'
    })
    declare cartItems: string[]

    @column()
    declare amount: number

    @column()
    declare status: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @hasMany(() => OrderItem)
    declare orderItems: HasMany<typeof OrderItem>
  }
