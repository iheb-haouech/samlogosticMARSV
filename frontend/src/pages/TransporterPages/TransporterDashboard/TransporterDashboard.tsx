import React, { useEffect } from "react";
import { Card } from "antd";
import { MdOutlinePending } from "react-icons/md";
import { IoTimerOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import OrderStatCard from "../../../components/molecules/OrderStatCard/OrderStatCard";
import OrdersStats from "../../../components/organisms/OrdersStats/OrdersStats";
import { fetchStatistics, selectedStatistic } from "../../../features/statistics/statisticsSlice";
import { useAppSelector } from "../../../store/hooks";
import { store } from "../../../store/store";
import { useTranslation } from "react-i18next";
import "./TransporterDashboard.scss";

const TransporterDashboard: React.FC = () => {
  const statistic = useAppSelector(selectedStatistic);
  const { t } = useTranslation();

  useEffect(() => {
    store.dispatch(fetchStatistics());
  }, []);

  return (
    <div className="transporter-dashboard-stats">
      <div className="dashboard-hero">
        <span>{t("transporterDashboard")}</span>
        <h2>{t("deliveryActivity")}</h2>
        <p>{t("transporterOrdersDesc")}</p>
      </div>

      <section className="transporter-dashboard-stats--orders-section">
        <Card className="orders-section--card" title={t("Orders Statistics")}>
          <div className="transporter-dashboard-stats--orders-cards-summary">
            <OrderStatCard
              title={t("pendingPackages")}
              value={statistic?.totalWaitingOrders ?? 0}
              icon={<MdOutlinePending color="#20e3b2" className="order-stat-card-icon" />}
            />
            <OrderStatCard
              title={t("packagesInDelivery")}
              value={statistic?.totalTransitOrders ?? 0}
              icon={<IoTimerOutline color="#00d4ff" className="order-stat-card-icon" />}
            />
            <OrderStatCard
              title={t("deliveredPackages")}
              value={statistic?.totalLivredOrders ?? 0}
              icon={<IoCheckmarkCircleOutline color="#45ff8f" className="order-stat-card-icon" />}
            />
            <OrderStatCard
              title={t("rejectedPackages")}
              value={statistic?.totalCanceledOrders ?? 0}
              icon={<IoCloseCircleOutline color="#ff6b6b" className="order-stat-card-icon" />}
            />
          </div>

          <div className="orders-chart">
            <OrdersStats
              data={[
                {
                  month: t("thisWeek"),
                  delivered: statistic?.totalLivredOrders ?? 0,
                  rejected: statistic?.totalCanceledOrders ?? 0,
                },
              ]}
            />
          </div>
        </Card>
      </section>
    </div>
  );
};

export default TransporterDashboard;
