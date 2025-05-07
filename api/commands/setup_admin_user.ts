import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import env from '#start/env'
import User from '#models/user'
import { ROLES } from '../app/enum/index.js'
import Role from '#models/role'

export default class SetupAdminUser extends BaseCommand {
  static commandName = 'setup:admin-user'
  static description = 'This command will create an admin user!!'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    try {
      let adminExists = await User.query()
        .whereHas('roles', (query) => {
          query.where('slug', ROLES.ADMIN)
        })
        .first()

      if (adminExists) {
        this.logger.info(
          `The admin user has been created already with account ${adminExists.email}, please go through the reset password process to reclaim the account`
        )
        return false
      }

      let admin = {
        first_name: 'Tushar',
        last_name: 'Deshmukh',
        email: env.get('ADMIN_EMAIL'),
        password: env.get('ADMIN_PASSWORD'),
        is_verified:true
      }

      let user = await User.findBy('email', admin.email)
      if (user) {
        this.logger.error('This email already exists, please try the different email address')
        return false
      }

      let roleAdmin = await Role.findBy('slug', ROLES.ADMIN)
      if (!roleAdmin) {
        this.logger.error('Unable to find role details, please make sure to run the seeders first')
        return false
      }

      user = await User.create(admin)

      await user.related('roles').attach([roleAdmin.id])

      this.logger.success('Admin user has been created successfully')
    } catch (error) {
      this.logger.error(error)
    }
  }
}
