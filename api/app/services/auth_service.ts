import { inject } from '@adonisjs/core'
import ResponseService from './response_service.js'
import {
  RegisterUserData,
  ForgotPassWordInput,
  ResetPasswordInput,
  LoginPayload,
  updateUserPayload,
  ChangePasswordInput,
} from '../types/user_interface.js'
import Role from '#models/role'
import User from '#models/user'
import PasswordReset from '#models/password_reset'
import crypto from 'crypto'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import ForgotPassword from '#mails/forgot_password_notification'
import SendEmailOtpNotification from '#mails/send_email_otp_notification'
import Otp from '#models/otp'
import { ApiResponse } from '../types/response_interface.js'
import hash from '@adonisjs/core/services/hash'
import Token from '#models/token'

@inject()
export default class AuthService {
  constructor(private responseService: ResponseService) {}

  public async registerUser(data: RegisterUserData): Promise<ApiResponse> {
    try {
      const user = await User.create(data)

      // Always attach "customer" role
      const customerRole = await Role.findBy('slug', 'customer')
      if (!customerRole) {
        return this.responseService.buildFailure('Customer role not found', { respCode: 500 })
      }

      await user.related('roles').attach([customerRole.id])

      // If the user wants to be a vendor too
      if (data.is_vendor) {
        const vendorRole = await Role.findBy('slug', 'vendor')
        if (vendorRole) {
          await user.related('roles').attach([vendorRole.id])
        }
      }

      this.sendOtp(data.email).catch((err) => this.responseService.buildLogger('error', err))

      return this.responseService.buildSuccess(
        'User registered successfully. OTP has been sent to your email.',
        user
      )
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while registering the user. Please try again later.',
        { respCode: 500 }
      )
    }
  }

  public async sendOtp(email: string) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      await Otp.updateOrCreate(
        { email },
        {
          otp,
          expiresAt: DateTime.now().plus({ minutes: 10 }),
          createdAt: DateTime.now(),
        }
      )

      await mail.send(new SendEmailOtpNotification(email, otp))

      return this.responseService.buildSuccess('OTP sent to email')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('something went wrong')
    }
  }

  public async verifyOtp(email: string, otp: string): Promise<ApiResponse> {
    try {
      const otpRecord = await Otp.query().where('email', email).andWhere('otp', otp).first()

      if (!otpRecord || DateTime.now() > otpRecord.expiresAt) {
        return this.responseService.buildFailure('Invalid or expired OTP', { respCode: 400 })
      }

      await otpRecord.delete()

      const user = await User.findBy('email', email)
      if (user) {
        user.isVerified = true
        await user.save()
      }

      return this.responseService.buildSuccess('OTP verified successfully')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while verifying the OTP. Please try again later.',
        { respCode: 500 }
      )
    }
  }

  public async forgotPassword(payload: ForgotPassWordInput): Promise<ApiResponse> {
    try {
      const user = await User.findBy('email', payload.email)

      // Always return generic success for security reasons
      if (!user) {
        return this.responseService.buildSuccess(
          'If this email exists, a reset link has been sent.'
        )
      }

      const token = crypto.randomBytes(32).toString('hex')

      await PasswordReset.updateOrCreate(
        { email: user.email },
        {
          token,
          createdAt: DateTime.utc(),
        }
      )

      // Fire and forget email sending
      mail
        .send(new ForgotPassword({ email: user.email, token }))
        .catch((err) => this.responseService.buildLogger('error', err))

      return this.responseService.buildSuccess('Reset link sent if email exists.')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while initiating the password reset process.',
        { respCode: 500 }
      )
    }
  }

  public async resetPassword(payload: ResetPasswordInput): Promise<ApiResponse> {
    try {
      const tokenEntry = await PasswordReset.query().where('token', payload.token).first()

      if (!tokenEntry) {
        return this.responseService.buildFailure('Invalid or expired token!', {
          respCode: 400,
        })
      }

      const user = await User.findBy('email', tokenEntry.email)
      if (!user) {
        return this.responseService.buildFailure('User not found', {
          respCode: 404,
        })
      }

      user.password = payload.password
      await user.save()

      await tokenEntry.delete()

      return this.responseService.buildSuccess('Password reset successfully!')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while resetting the password. Please try again later.',
        { respCode: 500 }
      )
    }
  }

  public async loginUser(payload: LoginPayload): Promise<ApiResponse> {
    try {
      const user = await User.findBy('email', payload.email)

      if (!user) {
        return this.responseService.buildFailure('Invalid email or password')
      }

      if (!user.isVerified) {
        return this.responseService.buildFailure('Please verify your email OTP to continue')
      }

      await User.verifyCredentials(payload.email, payload.password)

      //delete the previously created tokens
      const now = DateTime.utc()

      await Token.query()
        .where('tokenable_id', user.id)
        .whereNotNull('expires_at')
        .where('expires_at', '<=', now.toSQL())
        .delete()

      await user.load('roles')

      const roles = user.roles.map((role) => role.slug)
      const userRole = roles.join(', ') // In case of multiple roles, comma-separated

      const token = await User.accessTokens.create(user, ['*'], {
        name: 'API Token',
        expiresIn: '1 hour',
      })

      const { id, first_name, last_name, phone_number, email } = user

      return this.responseService.buildSuccess('Login Successful', {
        id,
        first_name,
        last_name,
        phone_number,
        email,
        role: userRole,
        token: token.value?.release(),
      })
    } catch (error) {
      return this.responseService.buildFailure('Invalid email or password')
    }
  }

  public async updateUser(userId: number, payload: updateUserPayload): Promise<ApiResponse> {
    try {
      const user = await User.findOrFail(userId)

      user.merge(payload)
      await user.save()

      const { id, first_name, last_name, email, phone_number, isVerified } = user

      return this.responseService.buildSuccess('User updated successfully!', {
        id,
        first_name,
        last_name,
        email,
        phone_number,
        isVerified,
      })
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while updating the user. Please try again later.',
        { respCode: 500 }
      )
    }
  }

  public async changePassword(user: User, payload: ChangePasswordInput): Promise<ApiResponse> {
    try {
      // Check if new password is same as current password
      const isSame = await hash.verify(user.password, payload.new_password)
      if (isSame) {
        return this.responseService.buildFailure(
          'New password cannot be the same as the old password',
          { respCode: 400 }
        )
      }

      const isValid = await hash.verify(user.password, payload.old_password)

      if (!isValid) {
        return this.responseService.buildFailure('Old password is incorrect', { respCode: 401 })
      }

      user.password = payload.new_password
      await user.save()

      return this.responseService.buildSuccess('Password updated successfully')
    } catch (error) {
      console.log('inside catch block')
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while updating the password. Please try again later.',
        { respCode: 500 }
      )
    }
  }
}
