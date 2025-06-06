import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import { Toaster } from "react-hot-toast";
import VerifyOtp from "./pages/Auth/VerifyOTP";
import ResetPassword from "./pages/Auth/ResetPassword";
import AuthGuard from "./AuthGuard";
import AccountSecurity from "./pages/Dashboard/AccountSecurity";
import DashboardLayout from "./components/DashboardLayout";
import AccountDetails from "./pages/Dashboard/AccountDetails";
import Category from "./pages/Dashboard/Category/Category";
import Product from "./pages/Dashboard/Products/Product";
import ListProducts from "./pages/Shop/ListProducts";
import ProductDetails from "./pages/Shop/ProductDetails";
import Wishlist from "./pages/Dashboard/Wishlist";
import Cancel from "./pages/Payment/Cancel";
import Success from "./pages/Payment/Success";
import Checkout from "./pages/Checkout/Index";
import Address from "./pages/Dashboard/Address/Address";
import MyOrder from "./pages/Order/MyOrder";
import Support from "./pages/Support/Index";
import OAuthCallback from "./pages/Auth/OAuthCallback";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/shop" element={<ListProducts />} />
            <Route path="/shop/:id" element={<ProductDetails />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/success" element={<Success />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* protected routes */}
            <Route path="/dashboard" element={<AuthGuard />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<AccountDetails />} />
                <Route path="address" element={<Address />} />
                <Route path="security" element={<AccountSecurity />} />
                <Route path="category" element={<Category />} />
                <Route path="products" element={<Product />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="orders" element={<MyOrder />} />
                <Route path="support" element={<Support />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
