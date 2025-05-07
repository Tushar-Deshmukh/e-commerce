import vine from '@vinejs/vine'

export const verifyOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine
      .string()
      .trim()
      .maxLength(6)
      .regex(/^\d{6}$/),
  })
)
