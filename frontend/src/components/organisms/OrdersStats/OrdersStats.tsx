import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";
import { primaryColor } from "../../../globalVar/colors";

type OrdersStatsProps = {
  data: {
    month: string;
    delivered: number;
    rejected: number;
  }[];
};

const OrdersStats: React.FC<OrdersStatsProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        width: "100%",
        height: 400,
      }}
    >
      <ResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} tickCount={7} />
          <Tooltip />
          <Legend verticalAlign='top' height={40} />
          <Bar
            radius={[4, 4, 0, 0]}
            dataKey='delivered'
            name={t("Delivered orders")}
            fill='#3779FB'
            shape={<Rectangle fill='#0557FA' />}
          />
          <Bar
            radius={[4, 4, 0, 0]}
            dataKey='rejected'
            name={t("Rejected orders")}
            fill='#FF3336'
            shape={<Rectangle fill={primaryColor} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersStats;
