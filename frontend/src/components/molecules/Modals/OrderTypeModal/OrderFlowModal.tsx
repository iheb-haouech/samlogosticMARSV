import { Button, Col, Flex, Input, Modal, Radio, Row } from "antd";
import { useEffect, useMemo, useState } from "react";

export type MainOrderType = "international" | "national" | "quote";
export type TradeType = "import" | "export";
export type TransportType = "aerien" | "maritime" | "ground" | "livrer" | "apporter";
export type SubType =
  | "groupement"
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
}

const SUBTYPE_OPTIONS: Record<"maritime" | "ground" | "aerien" | "national", { label: string; value: SubType }[]> = {
  maritime: [
    { label: "Groupement", value: "groupement" },
    { label: "CTS 20", value: "cts20" },
    { label: "CTS 40", value: "cts40" },
    { label: "CTS 40 HC", value: "cts40hc" },
    { label: "Autre", value: "other" },
  ],
  ground: [
    { label: "Groupement", value: "groupement" },
    { label: "SR berlie", value: "srberlie" },
    { label: "SR tole", value: "srtole" },
    { label: "Autre", value: "other" },
  ],
  aerien: [
    { label: "Groupement", value: "groupement" },
    { label: "Autre", value: "other" },
  ],
  national: [
    { label: "Envoi legere", value: "envoieLegere" },
    { label: "Envoi standard", value: "envoieStandard" },
    { label: "Camion tourisme", value: "camionTourisme" },
    { label: "Poid lourd 5T", value: "poidLourd5T" },
    { label: "Poid lourd 10T", value: "poidLourd10T" },
    { label: "Autre", value: "other" },
  ],
};

const OrderFlowModal = ({ open, mainType, onConfirm, onCancel }: Props) => {
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
  }, [open, mainType]);

  const isInternationalFlow = mainType === "international" || mainType === "quote";
  const options = useMemo(() => {
    if (isInternationalFlow) {
      return transportType === "maritime" || transportType === "ground" || transportType === "aerien"
        ? SUBTYPE_OPTIONS[transportType]
        : [];
    }
    return SUBTYPE_OPTIONS.national;
  }, [isInternationalFlow, transportType]);

  const canGoNext = isInternationalFlow ? !!transportType : !!tradeType;
  const canConfirm = !!subType && (subType !== "other" || otherMessage.trim().length > 0);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setSubType(null);
    setOtherMessage("");
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
        step === 1 ? (
          <Button key="next" type="primary" disabled={!canGoNext} onClick={handleNext}>
            Continuer
          </Button>
        ) : (
          <Button key="confirm" type="primary" disabled={!canConfirm} onClick={handleConfirm}>
            Confirmer
          </Button>
        ),
      ]}
    >
      <Flex vertical gap={16}>
        {step === 1 && isInternationalFlow && (
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
                <Radio value="ground">Ground</Radio>
              </Col>
              <Col span={8}>
                <Radio value="aerien">Aerien</Radio>
              </Col>
              <Col span={8}>
                <Radio value="maritime">Maritime</Radio>
              </Col>
            </Row>
          </Radio.Group>
        )}

        {step === 1 && mainType === "national" && (
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
        )}

        {step === 2 && (
          <>
            <Radio.Group value={subType ?? undefined} onChange={(event) => setSubType(event.target.value)} style={{ width: "100%" }}>
              <Row gutter={[12, 12]}>
                {options.map((opt) => (
                  <Col span={12} key={opt.value}>
                    <Radio value={opt.value}>{opt.label}</Radio>
                  </Col>
                ))}
              </Row>
            </Radio.Group>

            {subType === "other" && (
              <Input.TextArea
                rows={4}
                placeholder="Ajoutez votre message"
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
