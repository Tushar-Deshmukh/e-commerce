import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if the product already exists in the cart
      const existingItem = state.cartItems.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      // Remove the item from the cart
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== action.payload.productId
      );
    },
    setCartItems: (state, action) => {
      // Set the initial cart items (useful when loading the cart on page load)
      state.cartItems = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
