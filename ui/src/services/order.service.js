import axios from "../axios";
import { ApiConfig } from "../config/ApiConfig";

const getUserOrders = async () => {
  try {
    const res = await axios.get(ApiConfig.getUserOrders);
    return res;
  } catch (error) {
    return error?.response;
  }
};

const cancelOrder = async (selectedOrderId) => {
  try {
    const res = await axios.delete(
      `${ApiConfig.deleteOrder}/${selectedOrderId}`
    );
    return res;
  } catch (error) {
    return error?.response;
  }
};

const orderService = {
  getUserOrders,
  cancelOrder,
};

export default orderService;
