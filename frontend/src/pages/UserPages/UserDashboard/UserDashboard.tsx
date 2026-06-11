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

const UserDashboard: React.FC = () => {
  const statistic = useAppSelector(selectedStatistic);
  const { t } = useTranslation();

  useEffect(() => {
    store.dispatch(fetchStatistics());
  }, []);

  return (
    <div className="user-dashboard">
      <div className="dashboard-hero">
        <span>Client dashboard</span>
        <h2>Shipment activity</h2>
        <p>Live order performance for your SAM LOGISTIC account.</p>
      </div>

      <div className="user-dashboard-cards">
        <OrderStatCard
          title={t("pendingPackagesThisWeek")}
          value={statistic?.totalWaitingOrders ?? 0}
          icon={<MdOutlinePending color="#20e3b2" className="order-stat-card-icon" />}
        />
        <OrderStatCard
          title={t("packagesInTransitThisWeek")}
          value={statistic?.totalTransitOrders ?? 0}
          icon={<IoTimerOutline color="#00d4ff" className="order-stat-card-icon" />}
        />
        <OrderStatCard
          title={t("packagesDeliveredThisWeek")}
          value={statistic?.totalLivredOrders ?? 0}
          icon={<IoCheckmarkCircleOutline color="#45ff8f" className="order-stat-card-icon" />}
        />
        <OrderStatCard
          title={t("packagesRejectedThisWeek")}
          value={statistic?.totalCanceledOrders ?? 0}
          icon={<IoCloseCircleOutline color="#ff6b6b" className="order-stat-card-icon" />}
        />
      </div>

      <div className="orders-chart">
        <OrdersStats
          data={[
            {
              month: "This week",
              delivered: statistic?.totalLivredOrders ?? 0,
              rejected: statistic?.totalCanceledOrders ?? 0,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
