import { useState } from "react";
import { InputNumber, Button, message } from "antd";
import { useTranslation } from "react-i18next";

interface TransporterPriceProps {
  orderId?: string;
  currentPrice?: number;
  isAdmin?: boolean;
  onPriceUpdate?: (price: number) => void;
}

const TransporterPriceEditor: React.FC<TransporterPriceProps> = ({ orderId: _orderId, currentPrice, isAdmin, onPriceUpdate }) => {
  const { t } = useTranslation();
  const [price, setPrice] = useState<number | null>(currentPrice || null);

  const handleUpdate = () => {
    if (price === null) {
      message.error("Price is required");
      return;
    }
    onPriceUpdate?.(price);
    message.success("Price updated");
  };

  return (
    <div className="transporter-price-editor">
      <label>{t("transporterPrice") || "Transporter Price"}</label>
      {isAdmin ? (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <InputNumber
            value={price}
            onChange={(val) => setPrice(val)}
            min={0}
            formatter={(value) => `${value} DT`}
            parser={(value) => value?.replace(" DT", "") as any}
          />
          <Button type="primary" onClick={handleUpdate}>
            {t("confirmTransporterPrice") || "Confirm"}
          </Button>
        </div>
      ) : (
        <span>{price !== null ? `${price} DT` : "--"}</span>
      )}
    </div>
  );
};

export default TransporterPriceEditor;