import { ApiConfig } from "../config/ApiConfig";
import axios from "../axios";

const addAddress = async (data) => {
  try {
    const res = await axios.post(ApiConfig.addAddress, data);
    return res?.data;
  } catch (error) {
    console.log('error',error)
    return error?.response;
  }
};

const updateAddress = async (addressId ,data) => {
  try {
    const res = await axios.put(`${ApiConfig.updateAddress}/${addressId}`, data);
    return res?.data;
  } catch (error) {
    console.log('error',error)
    return error?.response;
  }
};

const getAddress = async () => {
  try {
    const res = await axios.get(ApiConfig.getAddress);
    return res?.data;
  } catch (error) {
    console.log('error',error)
    return error?.response;
  }
};

const getAddressById = async (id) => {
  try {
    const res = await axios.get(`${ApiConfig.getAddressById}/${id}`);
    return res?.data;
  } catch (error) {
    console.log('error',error)
    return error?.response;
  }
};

const deleteAddressById = async (id) => {
  try {
    const res = await axios.delete(`${ApiConfig.deleteAddressById}/${id}`);
    return res?.data;
  } catch (error) {
    console.log('error',error)
    return error?.response;
  }
};


const addressService = {
  addAddress,
  getAddress,
  getAddressById,
  updateAddress,
  deleteAddressById
};

export default addressService;
