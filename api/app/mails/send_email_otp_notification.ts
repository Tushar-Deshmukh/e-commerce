import { BaseMail } from '@adonisjs/mail'

export default class SendEmailOtpNotification extends BaseMail {
  constructor(
    private email: string,
    private otp: string
  ) {
    super()
  }

  prepare() {
    this.message.to(this.email).subject('Verify OTP').htmlView('emails/verifyotp', {
      otp: this.otp,
    })
  }
}
