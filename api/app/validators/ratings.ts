import vine from '@vinejs/vine'

export const createRatingValidator = vine.compile(
  vine.object({
    product_id: vine.number().exists(async (db, value) => {
      const product = await db.from('products').where('id', value).first()
      return !!product
    }),
    title: vine.string().minLength(2).maxLength(100),
    comment: vine.string().minLength(5).maxLength(500),
    rating: vine.number().min(1).max(5),
    recommended: vine.boolean(),
  })
)

export const updateRatingValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).optional(),
    comment: vine.string().trim().minLength(5).optional(),
    rating: vine.number().min(1).max(5).optional(),
    recommended: vine.boolean().optional(),
  })
)

export const createWishlistValidator = vine.compile(
  vine.object({
    product_id: vine.number().positive(),
  })
)
