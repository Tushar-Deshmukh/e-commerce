import React from "react";
import { CardIcon, PhoneIcon, TruckIcon } from "../assets/icons";

const HeaderInfo = () => {
  return (
    <div className="bg-[#24292e] p-2">
      <div className="container">
        <div className="flex justify-around items-center">
          <div className="hidden md:flex items-center text-white gap-2">
            <TruckIcon className="size-5" />
            <span>Free Shipping</span>
          </div>

          <div className="hidden md:flex items-center text-white gap-2">
            <CardIcon className="size-5" />
            <span>Payment Methods</span>
          </div>

          <div className="hidden md:flex items-center text-white gap-2">
            <PhoneIcon className="size-5" />
            <span>Call us 951-999-9999</span>
          </div>

          <div className="flex md:hidden items-center text-white gap-2">
            <PhoneIcon className="size-5" />
            <span> Need advice? Call us 951-999-9999</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderInfo;
