import { v2 as cloudinary } from 'cloudinary'
import cloudinaryConfig from '#config/cloudinary'


// Setup config
cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret,
})

// Define a basic custom file type
type UploadableFile = {
  tmpPath: string
}

export default class CloudinaryService {

  public async upload(
    file: UploadableFile
  ): Promise<{ status: boolean; url?: string; error?: string }> {
    try {
      const result = await cloudinary.uploader.upload(file.tmpPath, {
        folder: 'uploads',
        resource_type: 'image',
      })

      return {
        status: true,
        url: result.secure_url,
      }
    } catch (error) {
      return {
        status: false,
        error: error.message,
      }
    }
  }
}