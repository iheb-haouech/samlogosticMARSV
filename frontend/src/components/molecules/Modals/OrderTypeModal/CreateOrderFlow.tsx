import { useEffect, useState } from "react";
import DrawerComponent from "../../drawer/DrawerComponent";
import OrderTypeModal from "./OrderTypeModal";
import OrderFlowModal from "./OrderFlowModal";
import CreateOrderForm from "../../../templates/Forms/CreateOrderForm/CreateOrderForm";
import CreateAdminOrderForm from "../../../templates/Forms/CreateOrderForm/CreateAdminOrderForm";

type MainOrderType = "international" | "national" | "quote";
type TradeType = "import" | "export";
type TransportType = "aerien" | "maritime" | "ground" | "livrer" | "apporter";
type SubType =
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

interface OrderMeta {
  mainType: MainOrderType;
  tradeType?: TradeType;
  transportType?: TransportType;
  subType?: SubType;
  otherMessage?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onCreateOrder: (order: any) => void;
}

const CreateOrderFlow = ({ isOpen, onClose, currentUser, onCreateOrder }: Props) => {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orderMeta, setOrderMeta] = useState<OrderMeta | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (currentUser?.accountType === "B2C") {
        setOrderMeta({ mainType: "national" });
        setIsTypeModalOpen(false);
        setIsFlowModalOpen(true);
      } else {
        setIsTypeModalOpen(true);
      }
    } else {
      setIsTypeModalOpen(false);
      setIsFlowModalOpen(false);
      setIsDrawerOpen(false);
      setOrderMeta(null);
    }
  }, [currentUser?.accountType, isOpen]);

  const handleMainType = (type: MainOrderType) => {
    setOrderMeta({ mainType: type });
    setIsTypeModalOpen(false);
    setIsFlowModalOpen(true);
  };

  const handleFlowConfirm = (payload: {
    tradeType?: TradeType;
    transportType?: TransportType;
    subType?: SubType;
    otherMessage?: string;
  }) => {
    setOrderMeta((prev) => ({
      ...(prev as OrderMeta),
      ...payload,
    }));
    setIsFlowModalOpen(false);
    setIsDrawerOpen(true);
  };

  const handleCloseAll = () => {
    setIsTypeModalOpen(false);
    setIsFlowModalOpen(false);
    setIsDrawerOpen(false);
    setOrderMeta(null);
    onClose();
  };

  const isB2B = currentUser?.accountType === "B2B";

  return (
    <>
      <OrderTypeModal
        isModalOpen={isTypeModalOpen}
        handleOrderType={handleMainType}
        handleClose={handleCloseAll}
      />

      <OrderFlowModal
        open={isFlowModalOpen}
        mainType={orderMeta?.mainType ?? null}
        onConfirm={handleFlowConfirm}
        onCancel={handleCloseAll}
        isB2B={isB2B}
      />

      <DrawerComponent
        isOpen={isDrawerOpen}
        handleClose={handleCloseAll}
        title="Créer une commande"
        content={
          orderMeta ? (
            currentUser?.roleId === 1 || currentUser?.roleId === 4 ? (
              <CreateAdminOrderForm onCreateOrder={onCreateOrder} currentUser={currentUser} orderMeta={orderMeta} />
            ) : (
              <CreateOrderForm onCreateOrder={onCreateOrder} currentUser={currentUser} orderMeta={orderMeta} />
            )
          ) : null
        }
      />
    </>
  );
};

export default CreateOrderFlow;
