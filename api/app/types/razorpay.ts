export interface RazorpayConfig {
  key_id: string
  key_secret: string
  headers?: Record<string, string>
}

export interface CreateOrderPayload {
  amount: number
  currency?: string
  receipt?: string
  notes?: Record<string, string>
  partial_payment?: boolean
}

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  offer_id?: string
  status: 'created' | 'attempted' | 'paid'
  attempts: number
  notes: Record<string, string>
  created_at: number
}

export interface RazorpayPayment {
  id: string
  entity: string
  amount: number
  currency: string
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
  order_id: string
  invoice_id?: string
  international?: boolean
  method: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi'
  amount_refunded: number
  refund_status?: string
  captured: boolean
  description?: string
  card_id?: string
  bank?: string
  wallet?: string
  vpa?: string
  email: string
  contact: string
  notes: Record<string, string>
  fee?: number
  tax?: number
  error_code?: string
  error_description?: string
  error_source?: string
  error_step?: string
  error_reason?: string
  acquirer_data?: Record<string, any>
  created_at: number
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface CreateOrderRequest {
  amount: number
  currency?: string
  receipt?: string
  customer_info?: CustomerInfo
}

export interface CustomerInfo {
  name?: string
  email?: string
  contact?: string
}

export interface PaymentCapturePayload {
  payment_id: string
  amount: number
  currency?: string
}

export interface RazorpayWebhookPayload {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment: {
      entity: RazorpayPayment
    }
    order?: {
      entity: RazorpayOrder
    }
  }
  created_at: number
}

export interface RefundPayload {
  payment_id: string
  amount?: number
  notes?: Record<string, string>
}

export interface RazorpayRefund {
  id: string
  entity: string
  amount: number
  currency: string
  payment_id: string
  notes: Record<string, string>
  receipt?: string
  acquirer_data?: Record<string, any>
  created_at: number
  batch_id?: string
  status: 'pending' | 'processed' | 'failed'
  speed_processed: 'normal' | 'optimum'
  speed_requested: 'normal' | 'optimum'
}