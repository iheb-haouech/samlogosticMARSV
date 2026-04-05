import { Table, Button, DatePicker, Select, Row, Col } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

const InvoicesList = () => {
  const [data, setData] = useState([]);

  const fetchInvoices = async (filters = {}) => {
    try {
      const res = await axios.get(
        "http://localhost:6001/user/invoices",
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
        `http://localhost:6001/user/invoice-pdf?userId=${invoice.generatedFor}&from=2026-01-01&to=2026-12-31`,
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
    { title: "Invoice", dataIndex: "matricule" },
    { title: "HT", dataIndex: "totalHt" },
    { title: "TVA", dataIndex: "tva" },
    { title: "TTC", dataIndex: "ttc" },
    { title: "Net", dataIndex: "net" },
    { title: "Date", dataIndex: "createdAt" },
    { title: "From", dataIndex: "from" },
    { title: "To", dataIndex: "to" },
    {
      title: "PDF",
      render: (record: any) => (
        <Button onClick={() => downloadInvoice(record)}>
          Download
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <DatePicker.RangePicker onChange={handleFilter} />

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Select placeholder="Client" style={{ width: "100%" }} />
        </Col>
        <Col span={6}>
          <Select placeholder="Transporter" style={{ width: "100%" }} />
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default InvoicesList;