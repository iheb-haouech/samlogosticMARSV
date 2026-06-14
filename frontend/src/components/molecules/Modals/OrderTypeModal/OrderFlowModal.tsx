import { Button, Col, Flex, Input, Modal, Radio, Row, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";

export type MainOrderType = "international" | "national" | "quote";
export type TradeType = "import" | "export";
export type TransportType = "aerien" | "maritime" | "ground" | "livrer" | "apporter";
export type SubType =
  | "consolidation"
  | "cts20"
  | "cts40"
  | "cts40hc"
  | "srberlie"
  | "srtole"
  | "envoieLegere"
  | "envoieStandard"
  | "camionTourisme"
  | "poidLourd5T"
  | "poidLourd10T"
  | "other";

interface Props {
  open: boolean;
  mainType: MainOrderType | null;
  onConfirm: (payload: {
    tradeType?: TradeType;
    transportType?: TransportType;
    subType?: SubType;
    otherMessage?: string;
  }) => void;
  onCancel: () => void;
  isB2B?: boolean;
}

type InternationalTransportType = "ground" | "aerien" | "maritime";

const SUBTYPE_OPTIONS: Record<InternationalTransportType | "national", { label: string; value: SubType }[]> = {
  maritime: [
    { label: "Consolidation", value: "consolidation" },
    { label: "CTS 20", value: "cts20" },
    { label: "CTS 40", value: "cts40" },
    { label: "CTS 40 HC", value: "cts40hc" },
    { label: "Autre", value: "other" },
  ],
  ground: [
    { label: "Consolidation", value: "consolidation" },
    { label: "SR berlie", value: "srberlie" },
    { label: "SR tole", value: "srtole" },
    { label: "Autre", value: "other" },
  ],
  aerien: [
    { label: "Consolidation", value: "consolidation" },
    { label: "Autre", value: "other" },
  ],
  national: [
    { label: "Envoi légere", value: "envoieLegere" },
    { label: "Envoi standard", value: "envoieStandard" },
    { label: "Camion tourisme", value: "camionTourisme" },
    { label: "Poid lourd 5T", value: "poidLourd5T" },
    { label: "Poid lourd 10T", value: "poidLourd10T" },
    { label: "Autre", value: "other" },
  ],
};

const OrderFlowModal = ({ open, mainType, onConfirm, onCancel, isB2B = false }: Props) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [tradeType, setTradeType] = useState<TradeType | null>(null);
  const [transportType, setTransportType] = useState<TransportType | null>(null);
  const [subType, setSubType] = useState<SubType | null>(null);
  const [otherMessage, setOtherMessage] = useState("");

  const reset = () => {
    setStep(1);
    setTradeType(null);
    setTransportType(null);
    setSubType(null);
    setOtherMessage("");
  };

  useEffect(() => {
    reset();
  }, [open, mainType, isB2B]);

  const isInternationalFlow = mainType === "international";
  const isNationalFlow = mainType === "national";
  const isQuoteFlow = mainType === "quote";

  const internationalTransport = transportType as InternationalTransportType | null;

  const options = useMemo(() => {
    if (isInternationalFlow && internationalTransport) {
      return SUBTYPE_OPTIONS[internationalTransport];
    }
    if (isQuoteFlow) {
      return SUBTYPE_OPTIONS.national;
    }
    if (isNationalFlow) {
      return SUBTYPE_OPTIONS.national;
    }
    return [];
  }, [isInternationalFlow, isNationalFlow, isQuoteFlow, internationalTransport]);

  const needsTradeTypeStep = isB2B && (isNationalFlow || isInternationalFlow);

  const canGoNext =
    (isInternationalFlow && step === 1 && !!tradeType) ||
    (needsTradeTypeStep && step === 1 && !!tradeType);

  const canConfirm = !!subType && (subType !== "other" || otherMessage.trim().length > 0);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setSubType(null);
    setOtherMessage("");
    if (isInternationalFlow) {
      setTransportType(null);
    }
    setStep(2);
  };

  const handleConfirm = () => {
    if (!subType) return;

    onConfirm({
      tradeType: tradeType ?? undefined,
      transportType: isInternationalFlow ? transportType ?? undefined : tradeType === "import" ? "livrer" : "apporter",
      subType,
      otherMessage: subType === "other" ? otherMessage.trim() : undefined,
    });

    reset();
  };

  return (
    <Modal
      title="Choix du type de commande"
      open={open}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Annuler
        </Button>,
        step === 1 && (isInternationalFlow || needsTradeTypeStep) ? (
          <Button key="next" type="primary" disabled={!canGoNext} onClick={handleNext}>
            Continuer
          </Button>
        ) : (
          <Button key="confirm" type="primary" disabled={!canConfirm} onClick={handleConfirm}>
            Confirmer
          </Button>
        ),
      ]}
      width={isNationalFlow && !isInternationalFlow && !needsTradeTypeStep ? 500 : 600}
    >
      <Flex vertical gap={16}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {mainType && <Tag color="blue">{mainType}</Tag>}
          {tradeType && <Tag color="green">{tradeType}</Tag>}
          {transportType && <Tag color="orange">{transportType}</Tag>}
          {subType && <Tag color="purple">{subType}</Tag>}
          {otherMessage && <Tag color="red">{otherMessage}</Tag>}
        </div>

        {step === 1 && (isInternationalFlow || needsTradeTypeStep) && (
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Type de commerce</div>
            <Radio.Group
              value={tradeType ?? undefined}
              onChange={(event) => {
                setTradeType(event.target.value);
                setSubType(null);
                setOtherMessage("");
              }}
              style={{ width: "100%" }}
            >
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Radio value="import">Import</Radio>
                </Col>
                <Col span={12}>
                  <Radio value="export">Export</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </div>
        )}

        {step === 2 && isInternationalFlow && (
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Mode de transport</div>
            <Radio.Group
              value={transportType ?? undefined}
              onChange={(event) => {
                setTransportType(event.target.value);
                setSubType(null);
                setOtherMessage("");
              }}
              style={{ width: "100%" }}
            >
              <Row gutter={[12, 12]}>
                <Col span={8}>
                  <Radio value="ground">Over-the-Road (OTR)</Radio>
                </Col>
                <Col span={8}>
                  <Radio value="aerien">Aérien</Radio>
                </Col>
                <Col span={8}>
                  <Radio value="maritime">Maritime</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </div>
        )}

        {(step === 2 || (!isInternationalFlow && !needsTradeTypeStep)) && (
          <>
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                {isInternationalFlow ? "Sous-type" : "Type de commande"}
              </div>
              <Radio.Group
                value={subType ?? undefined}
                onChange={(event) => {
                  setSubType(event.target.value);
                  setOtherMessage("");
                }}
                style={{ width: "100%" }}
              >
                <Row gutter={[12, 12]}>
                  {options.map((opt) => (
                    <Col span={12} key={opt.value}>
                      <Radio value={opt.value}>{opt.label}</Radio>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
            </div>

            {subType === "other" && (
              <Input.TextArea
                rows={4}
                placeholder="Ajoutez votre demande et les détails requis"
                value={otherMessage}
                onChange={(event) => setOtherMessage(event.target.value)}
              />
            )}
          </>
        )}
      </Flex>
    </Modal>
  );
};

export default OrderFlowModal;
