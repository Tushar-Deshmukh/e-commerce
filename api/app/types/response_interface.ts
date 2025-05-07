export interface ResponseOptions {
  overrideHttpCode?: number
}

export interface ApiResponse<T = any> {
  status: 'success' | 'failure'
  data?: T
  message: string
}

export interface ValidationMessage {
  message: string
}

export type ValidationMessages = ValidationMessage[] | string
