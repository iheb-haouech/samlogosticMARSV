import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Orders from "../pages/SharedPages/Orders/Orders";
import DashboardLayout from "../pages/SharedPages/DashboardLayout/DashboardLayout";
// import Payment from "../pages/UserPages/Payment/Payment";
import ComplaintsChat from "../pages/SharedPages/ComplaintsChat/ComplaintsChat";
import UserDashboard from "../pages/UserPages/UserDashboard/UserDashboard";
import useSharedRoutes from "./useSharedRoutes";
import { UserProfile } from "../pages/SharedPages/UserProfile/UserProfile";
import { TrackOrderForm } from "../pages/SharedPages/TrackingOrders/TrackOrderForm";

const useUserRoutes = () => {
  const sharedRoutes = useSharedRoutes();
  return (
    <Routes>

      <Route
        path='/user'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path='dashboard' element={<UserDashboard />} />
        <Route path='orders' element={<Orders />} />
        {/* <Route path='payment' element={<Payment />} /> */}
        <Route path='complaints' element={<ComplaintsChat />} />
        <Route path='track-orders' element={<TrackOrderForm displayLogo={false} />} />
        <Route path='profile' element={<UserProfile />} />

        {/* Add more nested routes here if needed */}
      </Route>

      {/*  for future consideration  , 
          let's say we need to re-direct errors routes under profile routes , 
          you can uncomment the following line.
          NB : best practice for a smooth navigation experience within the parent route ( profile hnaa) of our application. 
      */}

      {/* <Route path="*" element={<Navigate replace to="profile" />} /> */}
      {/* Shared Routes* */}
      {sharedRoutes}
           
      <Route
        path='*'
        element={
          <ProtectedRoute>
            <Navigate replace to='/user/dashboard' />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
export default useUserRoutes;
