import { BaseMail } from '@adonisjs/mail'

export default class ForgotPassword extends BaseMail {
  constructor(private user: { email: string; token: string }) {
    super()
  }

  prepare() {
    this.message
      .to(this.user.email)
      .subject('Reset your password')
      .htmlView('emails/forgot_password', {
        token: this.user.token
      })
  }
}