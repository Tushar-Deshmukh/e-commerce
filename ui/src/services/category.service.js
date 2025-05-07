import axios from "../axios";
import { ApiConfig } from "../config/ApiConfig";

export const getCategoriesService = async () => {
  try {
    const res = await axios.get(ApiConfig.getAllCatgories);

    if (res.data?.status === "success") {
      return res?.data;
    }
  } catch (error) {
    if (error?.response) {
      return error?.response;
    }
  }
};

const getAllCatgories = async () => {
  try {
    const res = await axios.get(ApiConfig.getAllCatgories);

    if (res.data?.status === "success") {
      return res?.data;
    }
  } catch (error) {
    if (error?.response) {
      return error?.response;
    }
  }
};

const updateCategory = async (id, data) => {
  const res = await axios.put(`${ApiConfig.updateCategory}/${id}`, data);
  return res?.data;
};

const deleteCategory = async (id) => {
  const res = await axios.delete(`${ApiConfig.deleteCategory}/${id}`);

  return res.data;
};

const categoryService = {
  getAllCatgories,
  updateCategory,
  deleteCategory,
};

export default categoryService;