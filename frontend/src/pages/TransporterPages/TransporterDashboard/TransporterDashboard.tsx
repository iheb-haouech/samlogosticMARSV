import React, { useEffect } from "react";
import { Card } from "antd";
import { MdOutlinePending } from "react-icons/md";
import { IoTimerOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import OrderStatCard from "../../../components/molecules/OrderStatCard/OrderStatCard";
import OrdersStats from "../../../components/organisms/OrdersStats/OrdersStats";
import { fetchStatistics, selectedStatistic } from "../../../features/statistics/statisticsSlice";
import { useAppSelector } from "../../../store/hooks";
import { store } from "../../../store/store";
import "./TransporterDashboard.scss";

const TransporterDashboard: React.FC = () => {
  const statistic = useAppSelector(selectedStatistic);

  useEffect(() => {
    store.dispatch(fetchStatistics());
  }, []);

  return (
    <div className="transporter-dashboard-stats">
      <div className="dashboard-hero">
        <span>Transporter dashboard</span>
        <h2>Delivery activity</h2>
        <p>Orders assigned to your SAM LOGISTIC transporter account.</p>
      </div>

      <section className="transporter-dashboard-stats--orders-section">
        <Card className="orders-section--card" title="Statistiques des commandes">
          <div className="transporter-dashboard-stats--orders-cards-summary">
            <OrderStatCard
              title="Nombre de colis en attente"
              value={statistic?.totalWaitingOrders ?? 0}
              icon={<MdOutlinePending color="#20e3b2" className="order-stat-card-icon" />}
            />
            <OrderStatCard
              title="Nombre de colis en cours de livraison"
              value={statistic?.totalTransitOrders ?? 0}
              icon={<IoTimerOutline color="#00d4ff" className="order-stat-card-icon" />}
            />
            <OrderStatCard
              title="Nombre de colis livres"
              value={statistic?.totalLivredOrders ?? 0}
              icon={<IoCheckmarkCircleOutline color="#45ff8f" className="order-stat-card-icon" />}
            />
            <OrderStatCard
              title="Nombre de colis rejetes"
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
        </Card>
      </section>
    </div>
  );
};

export default TransporterDashboard;
