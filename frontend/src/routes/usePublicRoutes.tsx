import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/SharedPages/Login/Login";
import Signup from "../pages/UserPages/Signup/Signup";
import ForgotPassword from "../pages/UserPages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/UserPages/ForgotPassword/ResetPassword";
import TrackingOrders from "../pages/SharedPages/TrackingOrders/TrackingOrders";
import VerifyEmail from "../pages/SharedPages/Auth/VerifyEmail";

export const usePublicRoutes = () => {
  return (
    <Routes>
      <Route path="/tracking-orders" element={<TrackingOrders />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* tout ce qui n'est pas connu => login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="verify-email" element={<VerifyEmail />} />

    </Routes>
  );
};
