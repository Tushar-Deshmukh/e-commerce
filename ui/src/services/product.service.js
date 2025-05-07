import axios from "../axios";
import { ApiConfig } from "../config/ApiConfig";

const getAllProducts = async (queryParams = {}) => {
  try {
    const res = await axios.get(ApiConfig.getAllProducts, {
      params: {
        page: queryParams?.page || 1,
        perPage: queryParams?.perPage || 10,
        sortBy: queryParams?.sortBy || "newest_first",
        minPrice: queryParams?.minPrice || 100,
        maxPrice: queryParams?.maxPrice || 5000,
        averageRating: queryParams?.averageRating,
        categorySlug: queryParams?.categorySlug || "",
      },
    });
  
    return res.data;
  } catch (error) {
    console.log('error in products',error)
  }
  
};

const getProductById = async (id) => {
  const res = await axios.get(`${ApiConfig.getProduct}/${id}`);

  return res.data;
};

const updateProduct = async (id, data) => {
  const res = await axios.put(`${ApiConfig.updateProduct}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

const deleteProduct = async (id) => {
  const res = await axios.delete(`${ApiConfig.deleteProduct}/${id}`);

  return res.data;
};

const productService = {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

export default productService;
