import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2),
    description: vine.string().optional(),
    price: vine.number().positive(),
    category_id: vine.number().positive(),
  })
)