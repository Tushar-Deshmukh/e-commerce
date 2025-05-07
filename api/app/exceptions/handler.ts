import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import ResponseService from '#services/response_service'
import { errors as validationErrors } from '@vinejs/vine'
import { errors as authErrors } from '@adonisjs/auth'

export default class HttpExceptionHandler extends ExceptionHandler {

  constructor() {
    super()
    this.responseService = new ResponseService()
  }

  private responseService: ResponseService

  
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */

  async handle(error: any, ctx: HttpContext) {
    const { response } = ctx

    if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
      const errorResponse = this.responseService.buildFailure('Invalid email or password')
      return this.responseService.sendResponse(response, errorResponse, {
        overrideHttpCode: 401,
      })
    }

    if (error instanceof validationErrors.E_VALIDATION_ERROR) {
      const errorResponse = this.responseService.buildFailure('Validation Error', error.messages)
      return this.responseService.sendResponse(response, errorResponse, {
        overrideHttpCode: 422,
      })
    }

     // Log unknown errors
     this.responseService.buildLogger('error', error)

     const errorResponse = this.responseService.buildFailure(
       'Something went wrong. Please try again later.'
     )
 
     return this.responseService.sendResponse(response, errorResponse, {
       overrideHttpCode: error.status || 500,
     })

    // return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
