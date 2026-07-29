import { Table, Button, DatePicker, Select, Row, Col } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const apiBaseUrl = import.meta.env.VITE_BASE_URL;

const InvoicesList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  const fetchInvoices = async (filters = {}) => {
    try {
      const res = await axios.get(
        `${apiBaseUrl}/user/invoices`,
        { params: filters }
      );
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const downloadInvoice = async (invoice: any) => {
    try {
      const res = await axios.get(
        `${apiBaseUrl}/user/invoice-pdf?userId=${invoice.generatedFor}&from=2026-01-01&to=2026-12-31`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.matricule}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = (dates: any) => {
    if (!dates) return fetchInvoices();

    fetchInvoices({
      from: dates[0].toISOString(),
      to: dates[1].toISOString(),
    });
  };

  const columns = [
    { title: t("invoiceNumber"), dataIndex: "matricule" },
    { title: t("ht"), dataIndex: "totalHt" },
    { title: t("tva"), dataIndex: "tva" },
    { title: t("ttc"), dataIndex: "ttc" },
    { title: t("net"), dataIndex: "net" },
    { title: t("date"), dataIndex: "createdAt" },
    { title: t("from"), dataIndex: "from" },
    { title: t("to"), dataIndex: "to" },
    {
      title: "PDF",
      render: (record: any) => (
        <Button onClick={() => downloadInvoice(record)}>
          {t("download")}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <DatePicker.RangePicker onChange={handleFilter} />

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Select placeholder={t("clientFilter")} style={{ width: "100%" }} />
        </Col>
        <Col span={6}>
          <Select placeholder={t("transporterFilter")} style={{ width: "100%" }} />
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default InvoicesList;
