import React from "react";
import Title from "antd/es/typography/Title";
import "./UserStatCard.scss";
interface UserStatCardProps {
  title: string;
  value: number;
}

const UserStatCard: React.FC<UserStatCardProps> = ({ title, value }) => {
  return (
    <div className='user-stat-card'>
      <Title className='user-stat-card-title' level={5}>
        {title}
      </Title>
      <h1 className='user-stat-card-value'>{value}</h1>
    </div>
  );
};

export default UserStatCard;
