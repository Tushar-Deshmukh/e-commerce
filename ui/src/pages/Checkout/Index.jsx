import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAuthUser } from "../../store/slices/authSlice";
import addressService from "../../services/address.service";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ApiConfig } from "../../config/ApiConfig";
import axios from "../../axios";

const CheckoutPage = () => {
  const user = useSelector(getAuthUser);
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((acc, item) => {
    return acc + item?.product?.price * item?.quantity;
  }, 0);

  const getAddresses = async () => {
    try {
      const data = await addressService.getAddress();
      if (data.status === "success") {
        setAddresses(data.data || []);
        if (data.data?.length > 0) {
          setSelectedAddressId(data.data[0]?.id);
        }
      }
    } catch (error) {
      setAddresses([]);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select an address.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(ApiConfig.createPayment, {
        amount: total,
        cart: cartItems,
      });
      console.log("res", res);
      if (res?.data?.status === "success") {
        setLoading(false);
        window.location.href = res?.data?.data;
      }
    } catch (error) {
      setLoading(false);
      console.error("error", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-10 text-center text-base-content">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side: User Details & Address */}
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-2xl text-base-content">
              Shipping Details
            </h2>

            <div className="mb-6 text-base-content">
              <p>
                <strong>Name:</strong> {user?.first_name} {user?.last_name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone_number}
              </p>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center">
                <p className="text-base-content mb-4">No address found.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/add-address")}
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Select Address:
                  </span>
                </label>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className="flex items-start gap-4 p-4 border border-base-300 rounded cursor-pointer hover:bg-base-200"
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        className="radio radio-primary mt-1"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                      <div>
                        <p className="font-semibold capitalize text-base-content">
                          {address.type} Address
                        </p>
                        <p className="text-sm text-base-content">
                          {address.street}, {address.city}, {address.state},{" "}
                          {address.zip_code}, {address.country}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-2xl text-base-content mb-4">
              Order Summary
            </h2>

            <ul className="divide-y divide-base-200 mb-4">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex justify-between text-sm text-base-content"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between text-lg font-bold border-t border-base-300 pt-4 text-base-content">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="btn btn-primary w-full mt-6"
              disabled={loading}
            >
              {loading ? "Placing Order...." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
