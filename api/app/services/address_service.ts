import Address from '../models/address.js'
import { ApiResponse } from '../types/response_interface.js'
import ResponseService from './response_service.js'

export default class AddressService {
  constructor(private responseService = new ResponseService()) {}

  public async create(userId: number, payload: Partial<Address>): Promise<ApiResponse> {
    try {
      const address = await Address.create({ ...payload, userId })
      return this.responseService.buildSuccess('Address added successfully!', address)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to add address.')
    }
  }

  public async getUserAddresses(userId: number): Promise<ApiResponse> {
    try {
      const addresses = await Address.query().where('userId', userId)
      return this.responseService.buildSuccess('Addresses fetched successfully!', addresses)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to fetch addresses.')
    }
  }

  public async update(addressId: number, payload: Partial<Address>): Promise<ApiResponse> {
    try {
      const address = await Address.findOrFail(addressId)
      address.merge(payload)
      await address.save()

      return this.responseService.buildSuccess('Address updated successfully!', address)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to update address.')
    }
  }

  public async delete(addressId: number): Promise<ApiResponse> {
    try {
      const address = await Address.findOrFail(addressId)
      await address.delete()
      return this.responseService.buildSuccess('Address deleted successfully!')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to delete address.')
    }
  }

  public async getAddressById(addressId: number): Promise<ApiResponse> {
    try {
      const address = await Address.query().where('id', addressId).first()
      if (!address) {
        return this.responseService.buildFailure('address not found')
      }

      return this.responseService.buildSuccess('address found', address)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Failed to get address.')
    }
  }
}
