import logger from '@adonisjs/core/services/logger'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiResponse, ResponseOptions } from '../types/response_interface.js'

export default class ResponseService {
  buildSuccess(_message: string, _data?: any): ApiResponse {
    return {
      status: 'success',
      data: _data,
      message: _message,
    }
  }

  buildFailure(_message: string, _data?: any): ApiResponse {
    return {
      status: 'failure',
      data: _data,
      message: _message,
    }
  }

  sendResponse(
    _response: HttpContext['response'],
    _responseData: ApiResponse,
    _options?: ResponseOptions
  ) {
    let overrideHttpCode = (_options && _options['overrideHttpCode']) || false

    if (overrideHttpCode === false) {
      if (_responseData?.status === 'success') {
        overrideHttpCode = 200
      } else {
        overrideHttpCode = 500
      }
    }

    return _response.status(overrideHttpCode).json(_responseData)
  }

  buildLogger(_type: 'error' | 'warn' | 'info', _data: string | object) {
    if (typeof _data === 'string') {
      logger[_type](_data)
    } else {
      logger[_type](_data)
    }
  }
}