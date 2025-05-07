import axios from "../axios";
import { ApiConfig } from "../config/ApiConfig";

const addToCart = async (data) => {
  try {
    const res = await axios.post(ApiConfig.addToCart, data);
    return res.data;
  } catch (error) {
    return error;
  }
};

const getCartItems = async () => {
  try {
    const res = await axios.get(ApiConfig.getCartItems);
    return res.data;
  } catch (error) {
    if (error) {
      return error;
    }
  }
};

const removeFromCart = async (id) => {
  try {
    const res = await axios.delete(`${ApiConfig.removeFromCart}/${id}`);
    return res.data;
  } catch (error) {
    if (error) {
      return error;
    }
  }
};

const cartService = {
  addToCart,
  getCartItems,
  removeFromCart,
};

export default cartService;
