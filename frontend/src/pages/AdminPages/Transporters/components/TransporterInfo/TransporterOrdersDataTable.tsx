import { Segmented, Table, ConfigProvider, Button, Tag, message } from "antd";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import filterData from "../../../../../services/HelpertTransporter";
import { getOrderStatusName, getStatusColor } from "../../../../../services/order_status";
import copyToClipboard from "../../../../../services/copy";
import { useTranslation } from "react-i18next";
import { primaryColor } from "../../../../../globalVar/colors";

interface IOProps {
  orders: any;
}

const TransporterOrdersDataTable = ({ orders }: IOProps) => {
  const [filteredData, setFilteredData] = useState(orders);
  const { t } = useTranslation();
  const handleDateFilter = (value: any) => {
    const filtered = filterData(orders, value);
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleDateFilter("Tout");
  }, [orders]);

  const columns = [
    {
      title: t("tracking_number"),
      dataIndex: "trackingId",
      key: "trackingNumber",
      render: (trackingId: any) => (
        <>
          {trackingId}
          <Button
            onClick={() => {
              copyToClipboard(trackingId);
              message.success(`Numéro de suivi ${trackingId} copié avec succès.`, 1.5);
            }}
            size='small'
            style={{ marginLeft: "5px" }}
            className='table--action-btn'
            icon={<HiOutlineClipboardCopy />}
          />
        </>
      ),
    },
    {
      title: "Date de création",
      dataIndex: "createdAt",
      key: "creationDate",
    },
    {
      title: "Statut",
      dataIndex: "orderStatusId",
      key: "status",
      render: (status: any) => <Tag color={getStatusColor(status)}>{getOrderStatusName(status)}</Tag>,
    },
  ];
  const [tableHeight, setTableHeight] = useState(300);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const { top } = ref.current.getBoundingClientRect();
      // Adjust TABLE_HEADER_HEIGHT according to your actual header height.
      const TABLE_HEADER_HEIGHT = 55;
      setTableHeight(window.innerHeight - top - TABLE_HEADER_HEIGHT - 100);
    }
  }, [ref]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ fontWeight: "bold" }}>{t("delivered_orders")}</div>
      <ConfigProvider
        theme={{
          components: {
            Segmented: {
              itemSelectedBg: "#FFE5E6",
              itemSelectedColor: primaryColor,
              trackBg: "white",
            },
          },
        }}
      >
        <Segmented
          options={["Tout", "Aujourd'hui", "Cette semaine", "Ce mois-ci", "Cette année"]}
          onChange={(value) => handleDateFilter(value as string)}
        />
      </ConfigProvider>
      <p>
        {t("delivered_orders_count")}: {filteredData?.length}
      </p>
      <Table dataSource={filteredData} columns={columns} scroll={{ y: tableHeight, x: 500 }} />
    </div>
  );
};

export default TransporterOrdersDataTable;
