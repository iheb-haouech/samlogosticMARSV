// frontend/src/pages/TransporterPages/Invoices/TransporterInvoices.tsx
import React, { useEffect, useState } from "react";
import { Table, App  } from "antd";
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
  const { message } = App.useApp();
  const [data, setData] = useState<TransporterInvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.samlogistic.tn/transporter/invoices");
        if (!res.ok) throw new Error("Failed to load invoices");
        const json = await res.json();

        const rows: TransporterInvoiceRow[] = (json.invoices ?? []).map((item: any) => ({
          id: String(item.id),
          invoiceNumber: item.invoiceNumber ?? item.number ?? `INV-${item.id}`,
          period: item.period ?? "",
          totalAmount: Number(item.totalAmount ?? item.amount ?? 0),
          createdAt: item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : "",
        }));

        setData(rows);
      } catch {
        message.error("Impossible de charger les factures");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="transporter-invoices-page">
      <h2>Mes factures</h2>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TransporterInvoices;
