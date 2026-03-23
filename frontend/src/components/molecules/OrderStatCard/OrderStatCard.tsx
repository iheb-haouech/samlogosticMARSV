import React from "react";
import Title from "antd/es/typography/Title";
import "./OrderStatCard.scss";
interface OrderStatCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  backgroundColor?: string;
}

const OrderStatCard: React.FC<OrderStatCardProps> = ({ title, value, icon, backgroundColor = "white" }) => {
  return (
    <div className='order-stat-card' style={{ backgroundColor }}>
      <Title className='order-stat-card-title' level={5}>
        {title}
      </Title>
      <div className='order-stat-card-info'>
        <h1 className='order-stat-card-value'>{value}</h1>
        {icon}
      </div>
    </div>
  );
};

export default OrderStatCard;
