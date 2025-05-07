import type { HttpContext } from '@adonisjs/core/http'
import CloudinaryService from '#services/cloudinary_service'
import { inject } from '@adonisjs/core'
import ResponseService from '#services/response_service'
import { uploadImageValidator } from '#validators/upload_image'

@inject()
export default class UploadController {
  constructor(
    private responseService: ResponseService,
    private cloudinaryService: CloudinaryService
  ) {}

  public async uploadImage({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(uploadImageValidator)

      const image = payload.image

      if (!image || !image.tmpPath) {
        return this.responseService.sendResponse(
          response,
          this.responseService.buildFailure('No valid image file provided')
        )
      }

      const data = await this.cloudinaryService.upload({ tmpPath: image.tmpPath });

      if (!data.status) {
        return this.responseService.sendResponse(
          response,
          this.responseService.buildFailure('Failed to upload image to Cloudinary')
        )
      }

      return this.responseService.sendResponse(
        response,
        this.responseService.buildSuccess('Image uploaded successfully', { url: data.url }),
        { overrideHttpCode: 201 }
      )
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Failed to upload image')
      )
    }
  }
}
