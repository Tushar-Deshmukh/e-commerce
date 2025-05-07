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
}
