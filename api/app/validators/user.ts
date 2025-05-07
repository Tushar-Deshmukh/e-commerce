import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    first_name: vine.string().minLength(2),
    last_name: vine.string().minLength(2),
    brand: vine.string().minLength(2).optional(),
    business: vine.string().minLength(2).optional(),
    email: vine.string().email(),
    phone_number: vine.string().mobile().optional(),
    password: vine
      .string()
      .minLength(6)
      .maxLength(15)
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]).{8,}$/),
    is_vendor: vine.boolean().optional(),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: vine
      .string()
      .minLength(6)
      .maxLength(15)
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine
      .string()
      .minLength(6)
      .maxLength(15)
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    first_name: vine.string().minLength(2).optional(),
    last_name: vine.string().minLength(2).optional(),
    phone_number: vine.string().mobile().optional(),
  })
)

export const changePasswordValidator = vine.compile(
  vine.object({
    old_password: vine.string().minLength(6),
    new_password: vine.string().minLength(6).confirmed(),
  })
)
