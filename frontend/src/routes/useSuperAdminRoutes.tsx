import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../pages/SharedPages/DashboardLayout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminDashboard from "../pages/AdminPages/AdminDashboard/AdminDashboard";
import Orders from "../pages/SharedPages/Orders/Orders";
import ListeLivreurs from "../pages/AdminPages/Transporters/ListeLivreurs";
import ProvidersList from "../pages/AdminPages/Providers/ProvidersList";
import Invoices from "../pages/AdminPages/Invoices/Invoices";
import Cashflow from "../pages/AdminPages/Cashflow/Cashflow";
import ComplaintsChat from "../pages/SharedPages/ComplaintsChat/ComplaintsChat";
import { TrackOrderForm } from "../pages/SharedPages/TrackingOrders/TrackOrderForm";
import { UserProfile } from "../pages/SharedPages/UserProfile/UserProfile";
import SuperAdminUsers from "../pages/SuperAdminPages/SuperAdminUsers/SuperAdminUsers";

const useSuperAdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="transporters" element={<ListeLivreurs />} />
        <Route path="providers" element={<ProvidersList />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="cashflow" element={<Cashflow />} />
        <Route path="complaints" element={<ComplaintsChat />} />
        <Route path="track-orders" element={<TrackOrderForm displayLogo={false} />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route path="*" element={<Navigate replace to="/superadmin/dashboard" />} />
    </Routes>
  );
};

export default useSuperAdminRoutes;
