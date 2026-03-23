// frontend/src/pages/TransporterPages/TransporterDashboard/TransporterDashboard.tsx
import React from "react";
import { Card } from "antd";
import { MdOutlinePending } from "react-icons/md";
import { IoTimerOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import OrderStatCard from "../../../components/molecules/OrderStatCard/OrderStatCard";
import "./TransporterDashboard.scss";

const TransporterDashboard: React.FC = () => {
  return (
    <div className="transporter-dashboard-stats" style={{ height: "100%", overflow: "auto", padding: window.innerWidth <= 768 ? '8px' : '24px',
        background: '#f5f5f5',
        minHeight: '100vh', }}>
      <section className="transporter-dashboard-stats--orders-section">
        <Card className="orders-section--card" title="Statistiques des commandes" style={{ height: "100%", padding: window.innerWidth <= 768 ? '8px' : '24px', marginTop: 16,
}}>
          <div className="transporter-dashboard-stats--orders-cards-summary">
            <OrderStatCard
              title="Nombre de colis en attente"
              value={0}
              icon={<MdOutlinePending color="orange" className="order-stat-card-icon" />}
              backgroundColor="antiquewhite"
            />
            <OrderStatCard
              title="Nombre de colis en cours de livraison"
              value={0}
              icon={<IoTimerOutline color="blue" className="order-stat-card-icon" />}
              backgroundColor="#d7e7fa"
            />
            <OrderStatCard
              title="Nombre de colis livrés"
              value={0}
              icon={<IoCheckmarkCircleOutline color="green" className="order-stat-card-icon" />}
              backgroundColor="#daffda"
            />
            <OrderStatCard
              title="Nombre de colis rejetés"
              value={0}
              icon={<IoCloseCircleOutline color="red" className="order-stat-card-icon" />}
              backgroundColor="#ffebeb"
            />
          </div>
        </Card>
      </section>
    </div>
  );
};

export default TransporterDashboard;
