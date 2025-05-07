export interface RegisterUserData {
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number?: string
  is_vendor?: boolean
}

export interface ForgotPassWordInput {
  email: string
}

export interface ResetPasswordInput {
  password: string
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface updateUserPayload {
  first_name?:string,
  last_name?:string,
  phone_number?:string
}

export interface ChangePasswordInput {
  old_password:string,
  new_password:string
}
