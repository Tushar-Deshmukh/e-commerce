import { MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center  bg-gray-50 px-4">
      <MdCancel className="text-red-500 text-[80px] mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Cancelled</h1>
      <p className="text-gray-600 text-center max-w-md mb-6">
        Your payment was not completed, and the order has been cancelled. If
        this was a mistake, please try again or contact our support.
      </p>
      <Link
        to="/shop"
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Back to Shop
      </Link>
    </div>
  );
};

export default Cancel;
