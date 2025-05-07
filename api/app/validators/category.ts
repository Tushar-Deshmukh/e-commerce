import vine from '@vinejs/vine'

export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(50),
    slug: vine.string().minLength(2).maxLength(50),
    description: vine.string().optional(),
  })
)