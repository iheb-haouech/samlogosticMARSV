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
import useSharedRoutes from "./useSharedRoutes";
import { TrackOrderForm } from "../pages/SharedPages/TrackingOrders/TrackOrderForm";

// to implement nested routes with the new approch , check useUserRoutes
const useAdminRoutes = () => {
  const sharedRoutes = useSharedRoutes();
  return (
    <Routes>
      <Route
        path='/admin'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='orders' element={<Orders />} />
        <Route path='transporters' element={<ListeLivreurs />} />
        <Route path='providers' element={<ProvidersList />} />
        <Route path='invoices' element={<Invoices />} />
        {/* 
        <Route path='track-orders' element={<TrackOrders />} />
         */}
        <Route path='complaints' element={<ComplaintsChat />} />
        <Route path='track-orders' element={<TrackOrderForm displayLogo={false} />} />
        <Route path='profile' element={<UserProfile />} />

        {/* Add more nested routes here if needed */}
      </Route>
      {sharedRoutes}
      <Route path='*' element={<Navigate replace to='/admin/dashboard' />} />
    </Routes>
  );
};
export default useAdminRoutes;
