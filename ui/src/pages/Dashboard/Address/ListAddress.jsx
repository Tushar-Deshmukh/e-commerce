import React, { useEffect, useState } from "react";
import addressService from "../../../services/address.service";
import { FiMapPin, FiHome, FiEdit } from "react-icons/fi";

const ListAddresses = ({ handleEditAddressClick }) => {
  const [addresses, setAddresses] = useState([]);

  const getAddresses = async () => {
    try {
      const data = await addressService.getAddress();
      if (data.status === "success") {
        setAddresses(data?.data || []);
      }
    } catch (error) {
      setAddresses([]);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  if (addresses.length === 0) {
    return <div className="text-center text-lg">No addresses found.</div>;
  }

  return (
    <div>
      {addresses.map((address) => (
        <div
          key={address?.id}
          className="flex items-start bg-white hover:bg-gray-100 hover:cursor-pointer border border-gray-200 my-4 p-4 rounded relative"
          role="button"
          onClick={() => handleEditAddressClick(address?.id)}
        >
          <div className="mr-4 text-purple-600 text-xl mt-1">
            {address?.type === "home" ? <FiHome /> : <FiMapPin />}
          </div>

          <div className="flex-1">
            <h4 className="text-lg mb-1 font-semibold capitalize flex items-center gap-2">
              {address?.type}
            </h4>
            <p className="text-sm text-gray-700">
              {address?.street}, {address?.city}, {address?.state},{" "}
              {address?.zip_code}, {address?.country}
            </p>
          </div>

          <div className="absolute top-4 right-4 text-gray-500 hover:text-purple-600">
            <FiEdit size={18} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListAddresses;
