import { IoTimerOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlinePending } from "react-icons/md";
import "./UserDashboard.scss";
import OrderStatCard from "../../../components/molecules/OrderStatCard/OrderStatCard";
import OrdersStats from "../../../components/organisms/OrdersStats/OrdersStats";
import { store } from "../../../store/store";
import { useEffect } from "react";
import { useAppSelector } from "../../../store/hooks";
import { fetchStatistics, selectedStatistic } from "../../../features/statistics/statisticsSlice";
import { useTranslation } from "react-i18next";

// Static data for orders and user statistics
const staticOrderData = [
  { month: "Jan", delivered: 4000, rejected: 400 },
  { month: "Feb", delivered: 3000, rejected: 300 },
  { month: "Mar", delivered: 2000, rejected: 200 },
  { month: "Apr", delivered: 2780, rejected: 1000 },
  { month: "May", delivered: 1890, rejected: 0 },
  { month: "Jun", delivered: 2390, rejected: 200 },
  { month: "Jul", delivered: 3490, rejected: 2000 },
  { month: "Aug", delivered: 0, rejected: 0 },
  { month: "Sep", delivered: 0, rejected: 0 },
  { month: "Oct", delivered: 0, rejected: 0 },
  { month: "Nov", delivered: 0, rejected: 0 },
];

const UserDashboard: React.FC = () => {
  const statistic = useAppSelector(selectedStatistic);
  useEffect(() => {
    store.dispatch(fetchStatistics());
  }, []);
  const { t } = useTranslation();
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div className='user-dashboard-cards'>
        <OrderStatCard
          title={t("pendingPackagesThisWeek")}
          value={statistic?.totalWaitingOrders}
          icon={<MdOutlinePending color='orange' className='order-stat-card-icon' />}
          backgroundColor='antiquewhite'
        />
        <OrderStatCard
          title={t("packagesInTransitThisWeek")}
          value={statistic?.totalTransitOrders}
          icon={<IoTimerOutline color='blue' className='order-stat-card-icon' />}
          backgroundColor='#d7e7fa'
        />
        <OrderStatCard
          title={t("packagesDeliveredThisWeek")}
          value={statistic?.totalLivredOrders}
          icon={<IoCheckmarkCircleOutline color='green' className='order-stat-card-icon' />}
          backgroundColor='#daffda'
        />
        <OrderStatCard
          title={t("packagesRejectedThisWeek")}
          value={statistic?.totalCanceledOrders}
          icon={<IoCloseCircleOutline color='red' className='order-stat-card-icon' />}
          backgroundColor='#ffebeb'
        />
      </div>
      <div className='orders-chart'>
        <OrdersStats data={staticOrderData} />
      </div>
    </div>
  );
};

export default UserDashboard;
