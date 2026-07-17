import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Col, Empty, Row, Spin, Tag, Typography } from "antd";
import {
  IoCalendarOutline,
  IoCashOutline,
  IoCheckmarkDoneOutline,
  IoReturnDownBackOutline,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import "./B2BKpiDashboard.scss";
import { ClientKpis } from "../../../features/statistics/statisticsSlice";

const { Title, Paragraph, Text } = Typography;

// SLA targets used for anomaly detection.
const SLA = {
  onTimeRateMin: 90, // % of deliveries on time
  damageRateMax: 5, // % of damaged shipments
  returnRateMax: 3, // % of returns
  resolutionDaysMax: 3, // avg incident resolution (days)
};

interface KpiTileProps {
  title: string;
  value: string;
  suffix?: string;
  icon: JSX.Element;
  status: "good" | "warn" | "bad";
  hint?: string;
}

const statusColors: Record<KpiTileProps["status"], string> = {
  good: "#20e3b2",
  warn: "#ffd166",
  bad: "#ff6b6b",
};

const KpiTile = ({ title, value, suffix, icon, status, hint }: KpiTileProps) => (
  <Card className="kpi-tile" variant="outlined">
    <div className="kpi-tile--head">
      <span className="kpi-tile--icon" style={{ color: statusColors[status] }}>
        {icon}
      </span>
      <span className="kpi-tile--title">{title}</span>
    </div>
    <div className="kpi-tile--value" style={{ color: statusColors[status] }}>
      {value}
      {suffix && <span className="kpi-tile--suffix">{suffix}</span>}
    </div>
    {hint && <div className="kpi-tile--hint">{hint}</div>}
  </Card>
);

const rateStatus = (value: number, goodBelow: boolean, threshold: number): KpiTileProps["status"] => {
  if (goodBelow) {
    if (value <= threshold) return "good";
    if (value <= threshold * 1.5) return "warn";
    return "bad";
  }
  if (value >= threshold) return "good";
  if (value >= threshold * 0.8) return "warn";
  return "bad";
};

interface B2BKpiDashboardProps {
  data: ClientKpis | null;
  loading: boolean;
  accountName?: string;
}

export const B2BKpiDashboard = ({ data, loading, accountName }: B2BKpiDashboardProps) => {
  if (loading) {
    return (
      <div className="kpi-loading">
        <Spin size="large" tip="Chargement de vos indicateurs logistiques..." />
      </div>
    );
  }

  if (!data) {
    return <Empty description="Aucune donnée disponible pour le moment." />;
  }

  const { summary, kpis, monthlyVolume } = data;

  const onTimeStatus = rateStatus(kpis.onTimeRate, false, SLA.onTimeRateMin);
  const damageStatus = rateStatus(kpis.damageRate, true, SLA.damageRateMax);
  const returnStatus = rateStatus(kpis.returnRate, true, SLA.returnRateMax);
  const resolutionStatus = rateStatus(kpis.avgResolutionDays, true, SLA.resolutionDaysMax);

  const anomalies: string[] = [];
  if (onTimeStatus !== "good")
    anomalies.push(
      `Taux de livraison à temps en baisse (${kpis.onTimeRate}% < objectif ${SLA.onTimeRateMin}%)`,
    );
  if (damageStatus !== "good")
    anomalies.push(`Taux de dommages élevé (${kpis.damageRate}% > seuil ${SLA.damageRateMax}%)`);
  if (returnStatus !== "good")
    anomalies.push(`Taux de retour élevé (${kpis.returnRate}% > seuil ${SLA.returnRateMax}%)`);
  if (resolutionStatus !== "good")
    anomalies.push(
      `Résolution d'incidents ralentie (${kpis.avgResolutionDays} j > objectif ${SLA.resolutionDaysMax} j)`,
    );

  return (
    <div className="b2b-kpi-dashboard">
      <div className="dashboard-hero">
        <span>Tableau de bord B2B</span>
        <h2>Performance logistique</h2>
        <p>
          Indicateurs clés de votre activité{accountName ? ` — ${accountName}` : ""}.
          Analyse quotidienne de votre chaîne de livraison.
        </p>
      </div>

      <Row gutter={[16, 16]} className="kpi-grid">
        <Col xs={24} sm={12} md={8} lg={8}>
          <KpiTile
            title="Taux de livraison à temps"
            value={kpis.onTimeRate.toFixed(1)}
            suffix="%"
            icon={<IoCheckmarkDoneOutline />}
            status={onTimeStatus}
            hint={`Objectif SLA : ${SLA.onTimeRateMin}%`}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <KpiTile
            title="Taux de dommages"
            value={kpis.damageRate.toFixed(1)}
            suffix="%"
            icon={<IoWarningOutline />}
            status={damageStatus}
            hint={`Seuil SLA : ${SLA.damageRateMax}%`}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <KpiTile
            title="Temps moyen de résolution"
            value={kpis.avgResolutionDays.toFixed(1)}
            suffix="j"
            icon={<IoTimeOutline />}
            status={resolutionStatus}
            hint={`Objectif SLA : ${SLA.resolutionDaysMax} j`}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <KpiTile
            title="Coût moyen par colis"
            value={kpis.costPerParcel.toFixed(2)}
            suffix="DT"
            icon={<IoCashOutline />}
            status="good"
            hint={`${summary.delivered} livraisons`}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <KpiTile
            title="Taux de retour"
            value={kpis.returnRate.toFixed(1)}
            suffix="%"
            icon={<IoReturnDownBackOutline />}
            status={returnStatus}
            hint={`Seuil SLA : ${SLA.returnRateMax}%`}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <KpiTile
            title="Volume total"
            value={String(summary.totalOrders)}
            icon={<IoCalendarOutline />}
            status="good"
            hint={`${summary.inTransit} en transit · ${summary.returned} retours`}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="kpi-detail">
        <Col xs={24} lg={14}>
          <Card title="Tendance du volume mensuel" variant="outlined">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyVolume} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#20e3b2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#20e3b2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2b3a4a" />
                <XAxis dataKey="month" stroke="#9fb3c8" />
                <YAxis stroke="#9fb3c8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#0f1923", border: "1px solid #2b3a4a", color: "#fff" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  name="Commandes"
                  stroke="#20e3b2"
                  fill="url(#vol)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title="Détection d'anomalies & recommandations"
            variant="outlined"
            className="kpi-anomaly-card"
          >
            {anomalies.length === 0 ? (
              <Paragraph type="success">
                <Text strong>Aucun écart significatif.</Text> Vos indicateurs respectent les objectifs
                de service (SLA) de vos clients B2B. Continuez sur cette lancée.
              </Paragraph>
            ) : (
              <>
                <Paragraph>
                  <Text strong>Écarts détectés :</Text>
                </Paragraph>
                <ul className="kpi-anomaly-list">
                  {anomalies.map((a) => (
                    <li key={a}>
                      <Tag color="warning">SLA</Tag>
                      {a}
                    </li>
                  ))}
                </ul>
                <Paragraph className="kpi-reco">
                  <Text strong>Actions correctives proposées :</Text>
                </Paragraph>
                <ol className="kpi-reco-list">
                  <li>
                    Renforcer le suivi proactif des expéditions à risque (alertes ETA + relance
                    transporteur 24h avant échéance) pour sécuriser le taux de livraison à temps.
                  </li>
                  <li>
                    Activer un audit qualité sur l'emballage et la préparation des colis concernés afin
                    de réduire le taux de dommages et de retours.
                  </li>
                  <li>
                    Créer un point hebdomadaire dédié aux incidents ouverts et communiquer un plan
                    d'action chiffré à vos clients B2B pour préserver la confiance.
                  </li>
                </ol>
              </>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="kpi-summary">
        <Col span={24}>
          <Card variant="outlined">
            <Title level={5} style={{ marginTop: 0 }}>
              Résumé exécutif
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              Sur l'ensemble de votre activité : <Text strong>{summary.totalOrders}</Text> commandes
              (dont <Text strong>{summary.inTransit}</Text> en transit et <Text strong>{summary.delivered}</Text> livrées),
              taux de livraison à temps de <Text strong>{kpis.onTimeRate}%</Text>, taux de dommages de{" "}
              <Text strong>{kpis.damageRate}%</Text>, et <Text strong>{kpis.openClaims}</Text> incident(s)
              ouvert(s). Coût moyen par colis : <Text strong>{kpis.costPerParcel} DT</Text>.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default B2BKpiDashboard;
