import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import axios from "axios";
import { Fragment, useEffect, useMemo, useState } from "react";
import "./Cashflow.scss";

type CashflowUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  verified: boolean;
  blocked: boolean;
  walletBalance: number;
  accountType?: "B2B" | "B2C";
};

type Summary = {
  clientsWallet: number;
  transportersWallet: number;
  b2bDeliveredFees: number;
  b2cDeliveredRevenue: number;
  netServiceEstimate: number;
};

const apiBaseUrl = import.meta.env.VITE_BASE_URL;

const Cashflow = () => {
  const [clients, setClients] = useState<CashflowUser[]>([]);
  const [transporters, setTransporters] = useState<CashflowUser[]>([]);
  const [summary, setSummary] = useState<Summary>({
    clientsWallet: 0,
    transportersWallet: 0,
    b2bDeliveredFees: 0,
    b2cDeliveredRevenue: 0,
    netServiceEstimate: 0,
  });
  const [cashoutValues, setCashoutValues] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [receiveForm] = Form.useForm();
  const [payClientForm] = Form.useForm();
  const [settlementLoading, setSettlementLoading] = useState(false);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }),
    [],
  );

  const fetchCashflow = async () => {
    setLoading(true);
    try {
      const [summaryRes, clientsRes, transportersRes] = await Promise.all([
        axios.get(`${apiBaseUrl}/cashflow/summary`, { headers }),
        axios.get(`${apiBaseUrl}/cashflow/users?type=clients`, { headers }),
        axios.get(`${apiBaseUrl}/cashflow/users?type=transporters`, { headers }),
      ]);

      setSummary(summaryRes.data);
      setClients(clientsRes.data);
      setTransporters(transportersRes.data);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erreur lors du chargement cashflow.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashflow();
  }, []);

  const getName = (user: CashflowUser) =>
    user.companyName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

  const handleCashout = async (user: CashflowUser) => {
    const amount = cashoutValues[user.id] || 0;
    if (amount <= 0) {
      message.warning("Veuillez saisir un montant valide.");
      return;
    }
    if (amount > user.walletBalance) {
      message.error("Le cashout ne peut pas depasser le panier disponible.");
      return;
    }

    try {
      await axios.post(`${apiBaseUrl}/cashflow/users/${user.id}/cashout`, { amount }, { headers });
      message.success("Cashout enregistre.");
      setCashoutValues((prev) => ({ ...prev, [user.id]: 0 }));
      fetchCashflow();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erreur cashout.");
    }
  };

  const handleBlock = async (user: CashflowUser) => {
    try {
      await axios.patch(`${apiBaseUrl}/cashflow/users/${user.id}/block`, { blocked: !user.blocked }, { headers });
      message.success(user.blocked ? "Compte reactive." : "Compte bloque.");
      fetchCashflow();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erreur blocage.");
    }
  };

  const handleReceiveTransporter = async (values: { transporterId: number; amountReceived: number }) => {
    setSettlementLoading(true);
    try {
      await axios.post(`${apiBaseUrl}/cashflow/settlement/receive-transporter`, values, { headers });
      message.success("Montant transporteur recu.");
      receiveForm.resetFields();
      fetchCashflow();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erreur reception transporteur.");
    } finally {
      setSettlementLoading(false);
    }
  };

  const handlePayClient = async (values: { clientId: number; amountToGiveClient: number }) => {
    setSettlementLoading(true);
    try {
      await axios.post(`${apiBaseUrl}/cashflow/settlement/pay-client`, values, { headers });
      message.success("Versement client enregistre.");
      payClientForm.resetFields();
      fetchCashflow();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erreur versement client.");
    } finally {
      setSettlementLoading(false);
    }
  };

  const clientColumns: TableProps<CashflowUser>["columns"] = [
    {
      title: "Nom",
      key: "name",
      render: (_, user) => (
        <Fragment>
          <Typography.Text strong>{getName(user)}</Typography.Text>
          <Typography.Text type="secondary" style={{ display: "block" }}>
            {user.email}
          </Typography.Text>
        </Fragment>
      ),
    },
    {
      title: "Type",
      dataIndex: "accountType",
      key: "accountType",
      render: (value: string) => <Tag color={value === "B2C" ? "blue" : "purple"}>{value || "B2B"}</Tag>,
    },
    {
      title: "Statut",
      key: "status",
      render: (_, user) => <Tag color={user.blocked ? "red" : "green"}>{user.blocked ? "Bloque" : "Actif"}</Tag>,
    },
    {
      title: "Telephone",
      key: "phone",
      render: (_, user) => `${user.phoneCountryCode ? `+${user.phoneCountryCode} ` : ""}${user.phone || "-"}`,
    },
    {
      title: "Panier disponible",
      dataIndex: "walletBalance",
      key: "walletBalance",
      align: "right",
      render: (value) => `${Number(value || 0).toFixed(3)} DT`,
    },
    {
      title: "Cashout",
      key: "cashout",
      render: (_, user) => (
        <Space.Compact>
          <InputNumber
            min={0}
            max={user.walletBalance}
            value={cashoutValues[user.id] || 0}
            onChange={(value) => setCashoutValues((prev) => ({ ...prev, [user.id]: Number(value || 0) }))}
          />
          <Button type="primary" onClick={() => handleCashout(user)} disabled={user.walletBalance <= 0}>
            Valider
          </Button>
        </Space.Compact>
      ),
    },
    {
      title: "Blocage",
      key: "block",
      render: (_, user) => (
        <Button danger={!user.blocked} onClick={() => handleBlock(user)}>
          {user.blocked ? "Debloquer" : "Bloquer"}
        </Button>
      ),
    },
  ];

  const transporterColumns = clientColumns.filter((col) => col.key !== "accountType");

  return (
    <section className="cashflow-page">
      <Row gutter={12} className="cashflow-page--summary">
        <Col xs={24} sm={12} md={8} lg={4}>
          <span className="cashflow-page--metric">
            <span>Panier clients (a verser)</span>
            <strong>{summary.clientsWallet.toFixed(3)} DT</strong>
          </span>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <span className="cashflow-page--metric">
            <span>Panier transporteurs (a recevoir)</span>
            <strong>{summary.transportersWallet.toFixed(3)} DT</strong>
          </span>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <span className="cashflow-page--metric">
            <span>Panier B2B (frais livraison)</span>
            <strong>{summary.b2bDeliveredFees.toFixed(3)} DT</strong>
          </span>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <span className="cashflow-page--metric">
            <span>Panier B2C (colis + transport)</span>
            <strong>{(summary.b2cDeliveredRevenue || 0).toFixed(3)} DT</strong>
          </span>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <span className="cashflow-page--metric cashflow-page--metric-highlight">
            <span>Gain net estime</span>
            <strong>{(summary.netServiceEstimate || 0).toFixed(3)} DT</strong>
          </span>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Reglement transporteur" className="cashflow-page--settlement">
            <Form form={receiveForm} layout="vertical" onFinish={handleReceiveTransporter}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
              <Form.Item name="transporterId" label="Transporteur" rules={[{ required: true }]}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={transporters.map((t) => ({
                    value: t.id,
                    label: `${getName(t)} (${t.walletBalance.toFixed(3)} DT)`,
                  }))}
                />
              </Form.Item>
                </Col>
                <Col xs={24} md={12}>
              <Form.Item name="amountReceived" label="Montant recu du transporteur" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: "100%" }} addonAfter="DT" />
              </Form.Item>
                </Col>
                <Col xs={24}>
                  <Button type="primary" htmlType="submit" loading={settlementLoading} block>
                    Valider reception
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Versement client" className="cashflow-page--settlement">
            <Form form={payClientForm} layout="vertical" onFinish={handlePayClient}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
              <Form.Item name="clientId" label="Client" rules={[{ required: true }]}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={clients.map((c) => ({
                    value: c.id,
                    label: `${getName(c)} [${c.accountType || "B2B"}] (${c.walletBalance.toFixed(3)} DT)`,
                  }))}
                />
              </Form.Item>
                </Col>
                <Col xs={24} md={12}>
              <Form.Item
                name="amountToGiveClient"
                label="Montant a donner au client (colis)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} addonAfter="DT" />
              </Form.Item>
                </Col>
                <Col xs={24}>
                  <Button type="primary" htmlType="submit" loading={settlementLoading} block>
                    Valider versement
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      <section className="cashflow-page--section">
        <Typography.Title level={5}>Liste transporteurs</Typography.Title>
        <Table
          rowKey="id"
          loading={loading}
          columns={transporterColumns}
          dataSource={transporters}
          pagination={{ pageSize: 6 }}
        />
      </section>

      <section className="cashflow-page--section">
        <Typography.Title level={5}>Liste clients</Typography.Title>
        <Table rowKey="id" loading={loading} columns={clientColumns} dataSource={clients} pagination={{ pageSize: 6 }} />
      </section>
    </section>
  );
};

export default Cashflow;
