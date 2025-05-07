import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthUser } from "../../store/slices/authSlice";
import { roles } from "../../constants";

const Sidebar = () => {
  const authUser = useSelector(getAuthUser);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const buttonStyle = (path) =>
    `w-full btn border-t border-b rounded-none font-normal text-left px-4 py-3 ${
      isActive(path) ? "bg-white" : ""
    }`;

  // All links
  const baseLinks = [
    { path: "/dashboard", label: "Account Details" },
    { path: "/dashboard/security", label: "Account Security" },
    { path: "/dashboard/address", label: "Address" },
    { path: "/dashboard/orders", label: "Orders" },
    { path: "/dashboard/wishlist", label: "Wishlist" },
    { path: "/dashboard/support", label: "Support" },
  ];

  const adminLinks = [
    { path: "/dashboard/products", label: "Products" },
    { path: "/dashboard/category", label: "Categories" },
    { path: "/dashboard/brands", label: "Brands" },
    { path: "/dashboard/users", label: "Users" },
    { path: "/dashboard/merchants", label: "Merchants" },
  ];

  const allLinks =
    authUser.role === roles.ADMIN
      ? [...baseLinks.slice(0, 3), ...adminLinks, ...baseLinks.slice(3)]
      : baseLinks;

  return (
    <div className="px-4 w-1/4">
      <div className="border border-gray-300">
        <div className="px-6 py-2 text-center text-xl">Account</div>

        {allLinks.map(({ path, label }) => (
          <button
            key={path}
            className={buttonStyle(path)}
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
