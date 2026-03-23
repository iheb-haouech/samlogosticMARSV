// frontend/src/pages/TransporterPages/Invoices/TransporterInvoices.tsx
import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./TransporterInvoices.scss";

interface TransporterInvoiceRow {
  id: string;
  invoiceNumber: string;
  period: string;
  totalAmount: number;
  createdAt: string;
}

const TransporterInvoices: React.FC = () => {
  const data: TransporterInvoiceRow[] = [
    {
      id: "1",
      invoiceNumber: "INV-2025-001",
      period: "Janvier 2025",
      totalAmount: 123.456,
      createdAt: "2025-02-01",
    },
  ];

  const columns: ColumnsType<TransporterInvoiceRow> = [
    { title: "Facture", dataIndex: "invoiceNumber", key: "invoiceNumber" },
    { title: "Période", dataIndex: "period", key: "period" },
    {
      title: "Montant total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (v: number) => `${v.toFixed(3)} TND`,
    },
    { title: "Créée le", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <div className="transporter-invoices-page">
      <h2>Mes factures</h2>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default TransporterInvoices;
