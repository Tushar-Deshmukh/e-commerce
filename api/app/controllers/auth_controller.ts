import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import {
  changePasswordValidator,
  loginUserValidator,
  registerUserValidator,
  resetPasswordValidator,
  updateUserValidator,
} from '#validators/user'
import { forgotPasswordValidator } from '#validators/user'
import { verifyOtpValidator } from '#validators/verify_otp'
import User from '#models/user'
import Role from '#models/role'
import Token from '#models/token'
import { DateTime } from 'luxon'

@inject()
export default class AuthController {
  constructor(
    private responseService: ResponseService,
    private authService: AuthService
  ) {}

  public async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerUserValidator)
      const result = await this.authService.registerUser(payload)
      return this.responseService.sendResponse(response, result, { overrideHttpCode: 201 })
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while creating user')
      )
    }
  }

  public async verify({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(verifyOtpValidator)
      const result = await this.authService.verifyOtp(payload.email, payload.otp)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while verifying OTP')
      )
    }
  }

  public async forgot({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(forgotPasswordValidator)
      const result = await this.authService.forgotPassword(payload)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while processing your request. Please try again later.'
        )
      )
    }
  }

  public async reset({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(resetPasswordValidator)
      const result = await this.authService.resetPassword(payload)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while resetting the password. Please try again later.'
        )
      )
    }
  }

  public async login({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginUserValidator)
      const result = await this.authService.loginUser(payload)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      const message =
        error.messages?.[0]?.message ||
        (typeof error.message === 'string' ? error.message : 'Validation failed')

      const resData = this.responseService.buildFailure(message)
      return this.responseService.sendResponse(response, resData, {
        overrideHttpCode: 422,
      })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

      const resData = this.responseService.buildSuccess('Logout successful')

      return this.responseService.sendResponse(response, resData)
    } catch (error) {
      this.responseService.buildLogger('error', error)

      const resData = this.responseService.buildFailure('Something went wrong while logging out')
      return this.responseService.sendResponse(response, resData, { overrideHttpCode: 500 })
    }
  }

  public async updateUser({ auth, request, response }: HttpContext) {
    try {
      const userId = auth.user!.id
      const payload = await request.validateUsing(updateUserValidator)
      const result = await this.authService.updateUser(userId, payload)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while updating the user.')
      )
    }
  }

  public async changePassword({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(changePasswordValidator)
      const user = auth.user!
      const result = await this.authService.changePassword(user, payload)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while updating the password. Please try again later.'
        )
      )
    }
  }

  public async profile({ response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id
      const result = await this.authService.getUserProfile(userId)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while fetching user profile.')
      )
    }
  }

  public async socialAuth({ ally }: HttpContext) {
    try {
      return ally.use('google').redirect()
    } catch (error) {
      console.log(error)
    }
  }

  public async callback({ ally, response }: HttpContext) {
    try {
      const google = ally.use('google')

      if (google.accessDenied())
        return response.redirect('http://localhost:5173/login?error=access_denied')
      if (google.stateMisMatch()) return response.redirect('http://localhost:5173/login?error=csrf')
      if (google.hasError())
        return response.redirect(`http://localhost:5173/login?error=${google.getError()}`)

      const googleUser = await google.user()

      const existingUser = await User.findBy('email', googleUser.email)
      let user = existingUser

      if (!user) {
        user = await User.create({
          email: googleUser.email,
          first_name: googleUser.original.given_name,
          last_name: googleUser.original.family_name,
          password: '',
          isVerified: true,
        })

        const defaultRole = await Role.findByOrFail('slug', 'customer')
        await user.related('roles').attach([defaultRole.id])
      }

      const now = DateTime.utc()
      await Token.query()
        .where('tokenable_id', user.id)
        .whereNotNull('expires_at')
        .where('expires_at', '<=', now.toSQL())
        .delete()

      await user.load('roles')
      const roles = user.roles.map((role) => role.slug).join(',')

      const token = await User.accessTokens.create(user, ['*'], {
        name: 'OAuth Token',
        expiresIn: '1h',
      })

      // ⬇️ REDIRECT to frontend with token + user info
      const redirectUrl = `http://localhost:5173/oauth/callback?token=${token.value?.release()}&first_name=${user.first_name}&last_name=${user.last_name}&email=${user.email}&role=${roles}`

      return response.redirect(redirectUrl)
    } catch (error) {
      console.error('OAuth login error:', error)
      return response.redirect('http://localhost:5173/login?error=oauth_failed')
    }
  }
}
