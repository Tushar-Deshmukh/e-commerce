import { MdCheckCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center bg-gray-50 px-4">
      <MdCheckCircle className="text-green-500 text-[80px] mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful</h1>
      <p className="text-gray-600 text-center max-w-md mb-6">
        Thank you! Your payment was successful and your order has been placed.
        We’ll send you a confirmation email shortly with your order details.
      </p>
      <div className="flex gap-4">
        <Link
          to="/dashboard/orders"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          View Orders
        </Link>
        <Link
          to="/shop"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Success;
