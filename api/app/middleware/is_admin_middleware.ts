import type { HttpContext } from '@adonisjs/core/http'
import { hasRole } from '../helpers/index.js'

export default class IsAdminMiddleware {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    await user.load('roles')

    if (!hasRole(user, 'admin')) {
      return response.forbidden({ message: 'Admins only' })
    }

    await next()
  }
}
