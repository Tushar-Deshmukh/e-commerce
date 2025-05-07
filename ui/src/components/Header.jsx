import React, { useEffect, useState } from "react";
import { ArrowDownIcon, BagIcon, MenuIcon, ArrowUpIcon } from "../assets/icons";
import HeaderInfo from "./HeaderInfo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuthUser, setSignOut } from "../store/slices/authSlice";
import axios from "../axios";
import { ApiConfig } from "../config/ApiConfig";
import toast from "react-hot-toast";
import { setCartItems } from "../store/slices/cartSlice";

const Header = ({ onBagClick, onMenuClick, cartItemsCount }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector(getAuthUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClick = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
  };

  const handleLogout = async () => {
    handleClick();
    try {
      const res = await axios.post(ApiConfig.logout);
      if (res.data.status === "success") {
        toast.success(res?.data?.message);
        dispatch(setSignOut());
        dispatch(setCartItems([]));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="border-b border-b-gray-300">
      <HeaderInfo />
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-y-4 py-4">
          {/* Left: Menu Icon + Brand */}
          <div className="order-1 flex items-center gap-2">
            <button
              type="button"
              className="cursor-pointer hover:text-gray-500"
              onClick={onMenuClick}
            >
              <MenuIcon className="size-8" />
            </button>

            <span className="text-2xl">
              <Link to="/">MERN Store</Link>
            </span>
          </div>

          {/* Right: Cart Icon (mobile only) */}
          <div className=" order-2 w-1/4 sm:w-1/2 flex justify-end items-center gap-2 lg:hidden">
            <div className="relative">
              <button
                type="button"
                className=" cursor-pointer hover:text-gray-500"
                onClick={onBagClick}
              >
                <BagIcon />
              </button>

              {isAuthenticated && cartItemsCount > 0 && (
                <span className="absolute top-[-6px] left-[18px] bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cartItemsCount}
                </span>
              )}
            </div>
          </div>

          {/* Center: Search Input */}
          <div className="order-4 w-full lg:order-2 lg:w-1/2">
            <input
              type="text"
              className="w-full input focus:outline-0"
              placeholder="Search Products"
            />
          </div>

          {/* Right: Nav Items + Cart (desktop only) */}
          <div className="relative order-3 w-full lg:order-3 lg:w-1/4 flex justify-center lg:justify-start items-center">
            <div className="hidden lg:block">
              <button
                type="button"
                className="cursor-pointer hover:text-gray-500"
                onClick={onBagClick}
              >
                <BagIcon />
              </button>

              {isAuthenticated && cartItemsCount > 0 && (
                <span className="absolute top-[-6px] left-[18px] bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cartItemsCount}
                </span>
              )}
            </div>

            <ul className="flex items-center">
              {/* <li>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn bg-transparent border-0 shadow-none font-normal"
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 100)}
                  >
                    Brands{" "}
                    <span
                      className={`transition-transform duration-200 ease-in-out ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ArrowDownIcon className="size-3" strokeWidth={3} />
                    </span>
                  </div>

                  <ul
                    tabIndex={0}
                    className="menu dropdown-content bg-white rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
                  >
                    <li className="hover:bg-gray-50">
                      <a>Item 1</a>
                    </li>
                    <li>
                      <a>Item 2</a>
                    </li>
                  </ul>
                </div>
              </li> */}

              <li>
                <button
                  type="button"
                  className="btn bg-transparent border-0 shadow-none font-normal"
                  onClick={() => navigate("/shop")}
                >
                  Shop
                </button>
              </li>

              <li>
                <div className="dropdown dropdown-center">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn bg-transparent border-0 shadow-none font-normal"
                    onClick={toggleDropdown}
                  >
                    {isAuthenticated ? authUser?.first_name : "Welcome!"}{" "}
                    <span>
                      <ArrowDownIcon className="size-3" strokeWidth={3} />
                    </span>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-32 p-2 shadow-sm"
                  >
                    {isAuthenticated ? (
                      <>
                        <li onClick={handleClick}>
                          <Link to="/dashboard">Dashboard</Link>
                        </li>

                        <li onClick={handleLogout}>
                          <Link to="#">Logout</Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li onClick={handleClick}>
                          <Link to="/login">Login</Link>
                        </li>

                        <li onClick={handleClick}>
                          <Link to="/signup">Signup</Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
