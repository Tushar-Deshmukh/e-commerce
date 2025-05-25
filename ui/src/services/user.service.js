import { ApiConfig } from "../config/ApiConfig";
import axios from "../axios";

const getUserProfile = async () => {
  try {
    const res = await axios.get(ApiConfig.profile);
    return res.data;
  } catch (error) {
    console.log('error',error);
    return error?.response;
  }
};

const userService = {
  getUserProfile,
};

export default userService;
