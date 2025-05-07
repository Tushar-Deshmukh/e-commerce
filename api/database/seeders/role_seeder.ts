import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('slug',[
      {
        name:'Admin',
        slug:'admin',
        description:'An admin role to get started!'
      },

      {
        name:'Customer',
        slug:'customer',
        description:'An customer role to get started!'
      },

      {
        name:'Vendor',
        slug:'vendor',
        description:'An vendor role to get started!'
      },
    ])
  }
}