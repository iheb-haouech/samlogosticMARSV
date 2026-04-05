import React, { useEffect, useState } from "react";
import { IoTimerOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlinePending } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { HiOutlineTruck } from "react-icons/hi";
import UserStatCard from "../../../components/molecules/UserStatCard/UserStatCard";
import OrdersStats from "../../../components/organisms/OrdersStats/OrdersStats";
import { Card } from "antd";
import "./AdminDashboard.scss";
import OrderStatCard from "../../../components/molecules/OrderStatCard/OrderStatCard";
import { store } from "../../../store/store";
import { fetchStatistics, selectedStatistic } from "../../../features/statistics/statisticsSlice";
import { useAppSelector } from "../../../store/hooks";
import { useTranslation } from "react-i18next";


const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const statistic = useAppSelector(selectedStatistic);
  useEffect(() => {
    store.dispatch(fetchStatistics());
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
    <div className='admin-dashboard-statics' style={{ height: "100%", overflow: "auto" }}>
      <section className='admin-dashboard-statics--orders-section'>
        <Card className='orders-section--card' title={t("Orders Statistics")} style={{ height: "100%" }}>
          <div className='admin-dashboard-statics--orders-cards-summary'>
            <OrderStatCard
              title={t("Number of packages pending this week")}
              value={statistic?.totalWaitingOrders}
              icon={<MdOutlinePending color='orange' className='order-stat-card-icon' />}
              backgroundColor='antiquewhite'
            />
            <OrderStatCard
              title={t("Number of packages in transit this week")}
              value={statistic?.totalTransitOrders}
              icon={<IoTimerOutline color='blue' className='order-stat-card-icon' />}
              backgroundColor='#d7e7fa'
            />
            <OrderStatCard
              title={t("Number of packages delivered this week")}
              value={statistic?.totalLivredOrders}
              icon={<IoCheckmarkCircleOutline color='green' className='order-stat-card-icon' />}
              backgroundColor='#daffda'
            />
            <OrderStatCard
              title={t("Number of packages rejected this week")}
              value={statistic?.totalCanceledOrders}
              icon={<IoCloseCircleOutline color='red' className='order-stat-card-icon' />}
              backgroundColor='#ffebeb'
            />
          </div>
          <div className='orders-chart'>
            <OrdersStats data={orderData} />
          </div>
        </Card>
      </section>
      <section className='users-section'>
        <Card title={t("Utilisateurs")} style={{ height: "100%" }}>
          <div className='admin-dashboard-statics--users-card'>
            <div className='admin-dashboard-statics--providers-cards-summary'>
              <h3 className='admin-dashboard-statics--cards-title'>
                <FiUsers style={{ fontSize: "1.25rem" }} /> {t("Entreprises")}
              </h3>
              <UserStatCard 
                title={t("Nombre total d'entreprises vérifiées")} 
                value={statistic?.totalAcceptedProviders} 
              />
            </div>
            
            <div className='admin-dashboard-statics--providers-cards-summary'>
              <h3 className='admin-dashboard-statics--cards-title'>
                <HiOutlineTruck style={{ fontSize: "1.25rem" }} />
                {t("Transporteurs")}
              </h3>
              <UserStatCard
                title={t("Nombre total de transporteurs vérifiés")}
                value={statistic?.totalAcceptedTransporters}
              />
            </div>
          </div>
        </Card>
      </section>


       </div>
  );
};

export default AdminDashboard;
