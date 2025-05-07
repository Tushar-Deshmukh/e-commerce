import vine from '@vinejs/vine'

export const createCartItemValidator = vine.compile(
    vine.object({
      productId: vine.number().positive(),
      price: vine.number().positive(),
      quantity: vine.number().min(1),
    })
  )