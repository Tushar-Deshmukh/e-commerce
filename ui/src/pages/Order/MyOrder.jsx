import { useEffect, useState } from "react";
import orderService from "../../services/order.service";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const getMyOrders = async () => {
    try {
      const res = await orderService.getUserOrders();
      setOrders(res?.data?.data);
    } catch (error) {
      console.error("error:", error);
      setOrders([]);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrderId) return;

    try {
      const res = await orderService.cancelOrder(selectedOrderId);
      if (res?.data?.status === "success") {
        toast.success(res?.data?.message);
        setIsConfirmOpen(false);
        getMyOrders();
      }
    } catch (error) {
      setIsConfirmOpen(false);
      console.error("Failed to cancel order:", error);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-gray-500">You haven't placed any orders yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((item) => (
            <div
              key={item.id}
              className="relative card card-side bg-base-100 shadow-md border border-base-200"
            >
              <button
                className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
                onClick={() => {
                  setSelectedOrderId(item.id);
                  setIsConfirmOpen(true);
                }}
              >
                <IoClose size={18} />
              </button>

              <figure className="w-36 h-36 overflow-hidden">
                <img
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">{item.product.name}</h2>
                <p className="text-sm text-gray-500">
                  {item.product.description}
                </p>

                <div className="flex gap-6 mt-2 text-sm">
                  <span>
                    <strong>Quantity:</strong> {item.quantity}
                  </span>
                  <span>
                    <strong>Price:</strong> ₹{parseFloat(item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      {isConfirmOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Cancel Order</h3>
            <p className="py-4">Are you sure you want to cancel this order?</p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setIsConfirmOpen(false)}
              >
                No
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default MyOrder;
