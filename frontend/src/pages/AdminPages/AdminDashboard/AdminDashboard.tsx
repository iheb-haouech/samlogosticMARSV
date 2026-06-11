import React, { useEffect, useState } from "react";
import { IoTimerOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlinePending } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import OrdersStats from "../../../components/organisms/OrdersStats/OrdersStats";
import { Card, Col, Row } from "antd";
import axios from "axios";
import "./AdminDashboard.scss";
import OrderStatCard from "../../../components/molecules/OrderStatCard/OrderStatCard";
import { store } from "../../../store/store";
import { fetchStatistics, selectedStatistic } from "../../../features/statistics/statisticsSlice";
import { useAppSelector } from "../../../store/hooks";
import { useTranslation } from "react-i18next";

const apiBaseUrl = import.meta.env.VITE_BASE_URL;


const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const statistic = useAppSelector(selectedStatistic);
  const [cashflowSummary, setCashflowSummary] = useState({
    b2bDeliveredFees: 0,
    b2cDeliveredRevenue: 0,
    transportersWallet: 0,
    clientsWallet: 0,
    netServiceEstimate: 0,
  });

  useEffect(() => {
    store.dispatch(fetchStatistics());
    const loadCashflow = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/cashflow/summary`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setCashflowSummary(res.data);
      } catch {
        // ignore if not admin session
      }
    };
    loadCashflow();
  }, []);

  // State to hold dynamic order data
  const [orderData, setOrderData] = useState([{ month: `${new Date().getMonth()}`, delivered: 0, rejected: 0 }]);

  useEffect(() => {
    if (statistic) {
      setOrderData([
        {
          month: `${new Date().getMonth()}`,
          delivered: statistic.totalLivredOrders,
          rejected: statistic.totalCanceledOrders,
        },
      ]);
    }
  }, [statistic]);

  return (
    <div className="admin-dashboard-statics" style={{ height: "100%", overflow: "auto" }}>
      <div className="dashboard-hero">
        <span>{statistic?.totalAcceptedProviders || statistic?.totalAcceptedTransporters ? "Operations dashboard" : "SAM LOGISTIC"}</span>
        <h2>Project data overview</h2>
        <p>Role-aware logistics metrics for orders, clients, transporters, complaints, and cashflow.</p>
      </div>
      <section className="admin-dashboard-statics--orders-section">
        <Card className="orders-section--card" title={t("Orders Statistics")} style={{ height: "100%" }}>
          {/* Global stats */}
          <div className="admin-dashboard-statics--orders-cards-summary">
            <OrderStatCard
              title={t("Number of packages pending this week")}
              value={statistic?.totalWaitingOrders ?? 0}
              icon={<MdOutlinePending color="orange" className="order-stat-card-icon" />}
              backgroundColor="antiquewhite"
            />
            <OrderStatCard
              title={t("Number of packages in transit this week")}
              value={statistic?.totalTransitOrders ?? 0}
              icon={<IoTimerOutline color="blue" className="order-stat-card-icon" />}
              backgroundColor="#d7e7fa"
            />
            <OrderStatCard
              title={t("Number of packages delivered this week")}
              value={statistic?.totalLivredOrders ?? 0}
              icon={<IoCheckmarkCircleOutline color="green" className="order-stat-card-icon" />}
              backgroundColor="#daffda"
            />
            <OrderStatCard
              title={t("Number of packages rejected this week")}
              value={statistic?.totalCanceledOrders ?? 0}
              icon={<IoCloseCircleOutline color="red" className="order-stat-card-icon" />}
              backgroundColor="#ffebeb"
            />
          </div>

          {/* ✅ Nouveau bloc B2B */}
          <h3 style={{ marginTop: 24 }}>{t("B2B orders this week")}</h3>
          <div className="admin-dashboard-statics--orders-cards-summary">
            <OrderStatCard
              title={t("B2B pending")}
              value={statistic?.b2b?.waiting ?? 0}
              icon={<MdOutlinePending color="orange" className="order-stat-card-icon" />}
              backgroundColor="antiquewhite"
            />
            <OrderStatCard
              title={t("B2B in transit")}
              value={statistic?.b2b?.inTransit ?? 0}
              icon={<IoTimerOutline color="blue" className="order-stat-card-icon" />}
              backgroundColor="#d7e7fa"
            />
            <OrderStatCard
              title={t("B2B delivered")}
              value={statistic?.b2b?.delivered ?? 0}
              icon={<IoCheckmarkCircleOutline color="green" className="order-stat-card-icon" />}
              backgroundColor="#daffda"
            />
            <OrderStatCard
              title={t("B2B rejected")}
              value={statistic?.b2b?.canceled ?? 0}
              icon={<IoCloseCircleOutline color="red" className="order-stat-card-icon" />}
              backgroundColor="#ffebeb"
            />
          </div>

          {/* ✅ Nouveau bloc B2C */}
          <h3 style={{ marginTop: 24 }}>{t("B2C orders this week")}</h3>
          <div className="admin-dashboard-statics--orders-cards-summary">
            <OrderStatCard
              title={t("B2C pending")}
              value={statistic?.b2c?.waiting ?? 0}
              icon={<MdOutlinePending color="orange" className="order-stat-card-icon" />}
              backgroundColor="antiquewhite"
            />
            <OrderStatCard
              title={t("B2C in transit")}
              value={statistic?.b2c?.inTransit ?? 0}
              icon={<IoTimerOutline color="blue" className="order-stat-card-icon" />}
              backgroundColor="#d7e7fa"
            />
            <OrderStatCard
              title={t("B2C delivered")}
              value={statistic?.b2c?.delivered ?? 0}
              icon={<IoCheckmarkCircleOutline color="green" className="order-stat-card-icon" />}
              backgroundColor="#daffda"
            />
            <OrderStatCard
              title={t("B2C rejected")}
              value={statistic?.b2c?.canceled ?? 0}
              icon={<IoCloseCircleOutline color="red" className="order-stat-card-icon" />}
              backgroundColor="#ffebeb"
            />
          </div>

          <div className="orders-chart">
            <OrdersStats data={orderData} />
          </div>
        </Card>
      </section>

      <section className="admin-dashboard-statics--wallets">
        <Card title={t("adminWallets")}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={8}>
              <OrderStatCard
                title="Panier B2B (frais livraison)"
                value={cashflowSummary.b2bDeliveredFees}
                icon={<FiUsers color="#1a3a6b" className="order-stat-card-icon" />}
                backgroundColor="#eef3fb"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <OrderStatCard
                title="Panier B2C (colis + transport)"
                value={cashflowSummary.b2cDeliveredRevenue}
                icon={<FiUsers color="#2563eb" className="order-stat-card-icon" />}
                backgroundColor="#e8f1ff"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <OrderStatCard
                title="Gain net estime"
                value={cashflowSummary.netServiceEstimate}
                icon={<IoCheckmarkCircleOutline color="green" className="order-stat-card-icon" />}
                backgroundColor="#daffda"
              />
            </Col>
          </Row>
        </Card>
      </section>

      {/* ton bloc utilisateurs reste identique */}
      <section className="users-section">
        {/* ... inchangé ... */}
      </section>
    </div>
  );
};

export default AdminDashboard;
