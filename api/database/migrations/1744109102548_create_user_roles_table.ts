import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UserRoles extends BaseSchema {
  protected tableName = 'user_roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Auto-increment primary key
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users') // References 'id' column in 'users' table
        .onDelete('CASCADE') // Deletes related rows on parent deletion
        .index('user_id') // Creates an index for 'user_id'
      table
        .integer('role_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('roles') // References 'id' column in 'roles' table
        .index('role_id') // Creates an index for 'role_id'

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()).notNullable()
      table
        .timestamp('updated_at', { useTz: true })
        .defaultTo(this.raw('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'))
        .notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}