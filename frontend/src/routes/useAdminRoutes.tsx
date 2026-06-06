import { Navigate, Route, Routes } from "react-router-dom";
import { UserProfile } from "../pages/SharedPages/UserProfile/UserProfile";
import { ProtectedRoute } from "./ProtectedRoute";
import ListeLivreurs from "../pages/AdminPages/Transporters/ListeLivreurs";
import Orders from "../pages/SharedPages/Orders/Orders";
import ProvidersList from "../pages/AdminPages/Providers/ProvidersList";
import DashboardLayout from "../pages/SharedPages/DashboardLayout/DashboardLayout";
import ComplaintsChat from "../pages/SharedPages/ComplaintsChat/ComplaintsChat";
import AdminDashboard from "../pages/AdminPages/AdminDashboard/AdminDashboard";
import Invoices from "../pages/AdminPages/Invoices/Invoices";
import Cashflow from "../pages/AdminPages/Cashflow/Cashflow";
import useSharedRoutes from "./useSharedRoutes";
import { TrackOrderForm } from "../pages/SharedPages/TrackingOrders/TrackOrderForm";
import Home from "../pages/Home/Home";

const useAdminRoutes = () => {
  const sharedRoutes = useSharedRoutes();

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="transporters" element={<ListeLivreurs />} />
        <Route path="providers" element={<ProvidersList />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="cashflow" element={<Cashflow />} />
        <Route path="complaints" element={<ComplaintsChat />} />
        <Route path="track-orders" element={<TrackOrderForm displayLogo={false} />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {sharedRoutes}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default useAdminRoutes;