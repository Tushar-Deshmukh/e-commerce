import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('average_rating', 3, 2).defaultTo(0.0).after('thumbnail')
      table.integer('total_ratings').defaultTo(0).after('average_rating')
      table.integer('five_star_count').defaultTo(0).after('total_ratings')
      table.integer('four_star_count').defaultTo(0)
      table.integer('three_star_count').defaultTo(0)
      table.integer('two_star_count').defaultTo(0)
      table.integer('one_star_count').defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('average_rating')
      table.dropColumn('total_ratings')
      table.dropColumn('five_star_count')
      table.dropColumn('four_star_count')
      table.dropColumn('three_star_count')
      table.dropColumn('two_star_count')
      table.dropColumn('one_star_count')
    })
  }
}
