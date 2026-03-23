import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import DashboardLayout from "../pages/SharedPages/DashboardLayout/DashboardLayout";
import TransporterDashboard from "../pages/TransporterPages/TransporterDashboard/TransporterDashboard";
import TransporterOrders from "../pages/TransporterPages/Orders/TransporterOrders";
import TransporterInvoices from "../pages/TransporterPages/Invoices/TransporterInvoices";
import ComplaintsChat from "../pages/SharedPages/ComplaintsChat/ComplaintsChat";
import { UserProfile } from "../pages/SharedPages/UserProfile/UserProfile";
import TransporterOrderDetails from "../pages/TransporterPages/Orders/TransporterOrderDetails";

const useTransporterRoutes = () => {
  return (
    <Routes>
      <Route
        path="/transporter"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TransporterDashboard />} />
        <Route path="orders" element={<TransporterOrders />} />
        {/* 👇 route enfant relative pour le détail */}
        <Route path="orders/:id" element={<TransporterOrderDetails />} />
        <Route path="invoices" element={<TransporterInvoices />} />
        <Route path="complaints" element={<ComplaintsChat />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route path="*" element={<Navigate replace to="/transporter/dashboard" />} />
    </Routes>
  );
};

export default useTransporterRoutes;
