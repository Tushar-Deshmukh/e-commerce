const BASE_URL = "http://localhost:3333";
const CATEGORY_URL = `${BASE_URL}/admin/category`;
const PRODUCT_URL = `${BASE_URL}/admin/products`;

export const ApiConfig = {
  login: `${BASE_URL}/login`,
  signup: `${BASE_URL}/register`,
  verifyOtp: `${BASE_URL}/verify-otp`,
  forgotPassword: `${BASE_URL}/forgot`,
  resetPassword: `${BASE_URL}/reset`,
  logout: `${BASE_URL}/logout`,
  updateUser: `${BASE_URL}/update-user`,
  changePassword: `${BASE_URL}/change-password`,
  profile: `${BASE_URL}/profile`,
  OAuth:`${BASE_URL}/login/OAuth`,

  //address
  addAddress: `${BASE_URL}/address`,
  getAddress: `${BASE_URL}/address`,
  getAddressById: `${BASE_URL}/address`,
  updateAddress: `${BASE_URL}/address`,
  deleteAddressById:`${BASE_URL}/address`,

  //category
  createCategory: `${CATEGORY_URL}/create-category`,
  getAllCatgories: `${CATEGORY_URL}/categories`,
  getCategoryById: `${CATEGORY_URL}/show-category`,
  updateCategory: `${CATEGORY_URL}/update-category`,
  deleteCategory: `${CATEGORY_URL}/delete-category`,

  //product
  addProduct: `${PRODUCT_URL}/create-product`,
  getAllProducts: `${PRODUCT_URL}/get-all-products`,
  getProduct: `${PRODUCT_URL}/get-product`,
  updateProduct: `${PRODUCT_URL}/update-product`,
  deleteProduct: `${PRODUCT_URL}/delete-product`,

  //ratings
  addRating: `${BASE_URL}/ratings/create-rating`,
  ratingByProduct: `${BASE_URL}/ratings/product`,

  //wishlist
  wishlistedProducts: `${BASE_URL}/wishlist/wishlisted-products`,
  toggleWishlist: `${BASE_URL}/wishlist/add-to-wishlist`,
  mywishlist: `${BASE_URL}/wishlist/my-wishlist`,
  removeFromWishlist: `${BASE_URL}/wishlist/remove-from-wishlist`,

  //cart
  addToCart: `${BASE_URL}/cart`,
  getCartItems: `${BASE_URL}/cart`,
  removeFromCart: `${BASE_URL}/cart`,

  //payment
  createPaymentLink:`${BASE_URL}/create-payment-link`,

  //upload-image
  uploadImage: `${BASE_URL}/upload/image`,

  //order
  getUserOrders:`${BASE_URL}/orders`,
  deleteOrder:`${BASE_URL}/delete-orders`
};
