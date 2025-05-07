import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { fetchCategories, getCategories } from "../store/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiCloseLargeFill } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import cartService from "../services/cart.service";
import { setCartItems } from "../store/slices/cartSlice";
import { BagIcon } from "../assets/icons";
import { RiDeleteBin5Fill } from "react-icons/ri";
import toast from "react-hot-toast";

const Layout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const categories = useSelector(getCategories);
  const cartItems = useSelector((state) => state?.cart?.cartItems);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const drawerContentRef = useRef("categories");
  const drawerPositionRef = useRef("left");
  const [drawerKey, setDrawerKey] = useState(0); // To force re-render when content changes

  console.log(cartItems);

  const openDrawer = (contentType, position = "left") => {
    drawerContentRef.current = contentType;
    drawerPositionRef.current = position;

    // Force re-render to update drawer-side class and content
    setDrawerKey((prev) => prev + 1);

    // Apply `drawer-end` class conditionally
    const drawerWrapper = document.querySelector(".drawer");
    if (drawerWrapper) {
      drawerWrapper.classList.toggle("drawer-end", position === "right");
    }

    // Open the drawer
    const drawerCheckbox = document.getElementById("my-drawer");
    if (drawerCheckbox) {
      drawerCheckbox.checked = true;
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await cartService.getCartItems();
      if (res.status === "success") {
        dispatch(setCartItems(res?.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    const drawerCheckbox = document.getElementById("my-drawer");
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  async function removeItemFromCart(id) {
    try {
      const res = await cartService.removeFromCart(id);
      if (res?.status === "success") {
        toast.success(res?.message);
        fetchCartItems();
      }
    } catch (error) {
      console.error(error);
    }
  }

  function returnCartTotal(cartItems) {
    const total =
      cartItems.length > 0
        ? cartItems.reduce((acc, curr) => {
            return acc + curr?.price;
          }, 0)
        : 0;

    return total;
  }

  return (
    <div className="drawer">
      {/* Drawer Toggle Checkbox */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        <Header
          onBagClick={() => openDrawer("cart", "right")}
          onMenuClick={() => openDrawer("categories", "left")}
          cartItemsCount={cartItems.length || 0}
        />

        <main className="flex-grow-1 bg-[#f6f7f8]">
          <div className="container">
            <div className="py-6">
              <Outlet />
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Drawer Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <ul className="menu bg-base-200 text-base-content min-h-full p-0 w-[30%]">
          {/* Sidebar Items */}
          <div className="flex justify-end pt-4">
            <button
              className="text-xl px-4 cursor-pointer"
              onClick={() => {
                const drawerCheckbox = document.getElementById("my-drawer");
                if (drawerCheckbox) {
                  drawerCheckbox.checked = !drawerCheckbox.checked;
                }
              }}
            >
              <RiCloseLargeFill />
            </button>
          </div>

          <hr className="my-4 text-gray-400" />

          {drawerContentRef.current === "cart" ? (
            <div className="grow">
              <div className="p-4 h-full overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="w-full md:min-w-100 h-full flex flex-col justify-center items-center ">
                    <BagIcon />
                    <h3 className="text-3xl">Your Cart Is Empty</h3>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {cartItems.length > 0 &&
                      cartItems.map((item) => {
                        return (
                          <div key={item?.id} className="">
                            <div className="flex items-center justify-between">
                              {/* product image and name */}
                              <div className="flex items-center">
                                <img
                                  src={item?.product?.thumbnail}
                                  className="w-30 h-20 object-cover"
                                />
                                <p className="text-primary text-lg px-2">
                                  {item?.product?.name}
                                </p>
                              </div>

                              {/* remove from cart icon */}
                              <div className="px-2">
                                <button
                                  type="button"
                                  className="btn p-0 border-0 hover:bg-transparent"
                                  onClick={() => removeItemFromCart(item?.id)}
                                >
                                  <RiDeleteBin5Fill size={25} />
                                </button>
                              </div>
                            </div>

                            {/* quantity and price */}
                            <div className="mt-2">
                              <div className="flex items-center justify-between">
                                <p className="text-lg">Price</p>
                                <span className="text-xl">{item?.price}</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <p className="text-lg">Qunatity</p>
                                <span className="text-xl">
                                  {item?.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="mt-4 p-4 bg-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="text-lg">Shipping</p>
                    <span className="text-xl font-semibold">Free</span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-lg">Total</p>
                    <span className="text-xl font-semibold">
                      {returnCartTotal(cartItems)}
                    </span>
                  </div>

                  <hr className="my-4 text-gray-400" />
                  <div className="flex justify-center items-center gap-4">
                    <button
                      className="btn btn-primary btn-outline"
                      onClick={() => {
                        const drawerCheckbox =
                          document.getElementById("my-drawer");
                        if (drawerCheckbox) {
                          drawerCheckbox.checked = !drawerCheckbox.checked;
                        }
                      }}
                    >
                      Continue Shopping
                    </button>
                    <button className="btn btn-primary btn-outline">
                      Proceed To Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-2xl p-4">Shop By Category</h2>

              {categories.length > 0 &&
                categories.map((category) => {
                  return (
                    <li
                      key={category?.id}
                      className="p-0 hover hover:border-l-4 hover:border-l-primary"
                    >
                      <Link
                        to={`/shop?categorySlug=${category?.slug}`}
                        className="p-3"
                      >
                        {category?.name}
                      </Link>
                    </li>
                  );
                })}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Layout;
