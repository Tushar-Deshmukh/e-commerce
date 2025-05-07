import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthUser } from "../store/slices/authSlice";
import Sidebar from "../pages/Dashboard/Sidebar";

const DashboardLayout = () => {
  const authUser = useSelector(getAuthUser);

  return (
    <div className="flex items-start">
      <Sidebar authUser={authUser} />
      <div className="flex-1 px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
