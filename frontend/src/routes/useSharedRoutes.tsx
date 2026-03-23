import { Route } from "react-router-dom";
import TrackingOrders from "../pages/SharedPages/TrackingOrders/TrackingOrders";

const useSharedRoutes = () => {
  // to implement nested routes with the new approch , check useUserRoutes
  // to implement nested routes with the new approch ,
  return (
    <>
      <Route path='/shared' element={<div>shared </div>} />
      <Route path='/shared-route' element={<div>shared route </div>} />
      <Route path='/tracking-orders' element={<TrackingOrders />} />
    </>
  );
};
export default useSharedRoutes;
