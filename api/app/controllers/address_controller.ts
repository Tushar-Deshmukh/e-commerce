import type { HttpContext } from '@adonisjs/core/http'
import AddressService from '../services/address_service.js'
import ResponseService from '../services/response_service.js'

export default class AddressController {
  private addressService = new AddressService()
  private responseService = new ResponseService()

  public async store({ request, response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id
      const payload = request.only(['type', 'street', 'city', 'state', 'postal_code', 'country'])

      const result = await this.addressService.create(userId, payload)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while creating address.')
      )
    }
  }

  public async index({ response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id
      const result = await this.addressService.getUserAddresses(userId)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while fetching addresses.')
      )
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const addressId = Number(params.id)
      const payload = request.only(['type', 'street', 'city', 'state', 'zip', 'country'])

      const result = await this.addressService.update(addressId, payload)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while updating address.')
      )
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const addressId = Number(params.id)
      const result = await this.addressService.delete(addressId)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while deleting address.')
      )
    }
  }

  public async getAddress({ params, response }: HttpContext) {
    try {
      const addressId = Number(params.id)
      const result = await this.addressService.getAddressById(addressId)
      return this.responseService.sendResponse(response, result)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure('Something went wrong while deleting address.')
      )
    }
  }
}
