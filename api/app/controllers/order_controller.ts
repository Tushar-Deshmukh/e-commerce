import OrderService from '#services/order_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class OrderController {
  constructor(
    private responseService: ResponseService,
    private orderSercvice: OrderService
  ) {}

  public async getUserOrders({ response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id

      const result = await this.orderSercvice.getOrdersByUser(userId)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('error getting user order', error),
        { overrideHttpCode: 500 }
      )
    }
  }

  public async deleteUserOrders({ request,response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id
      const {orderId} = request.params();

      const result = await this.orderSercvice.deleteUserOrderById(userId,orderId)

      return this.responseService.sendResponse(response, result)
    } catch (error) {
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('error deleting order', error),
        { overrideHttpCode: 500 }
      )
    }
  }
}
