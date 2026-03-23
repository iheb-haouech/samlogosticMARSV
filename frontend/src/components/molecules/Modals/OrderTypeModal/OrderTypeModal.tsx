import { Button, Flex, Modal } from "antd";
import Title from "antd/es/typography/Title";
import colors from "../../../../styles/colors/colors";
import { useTranslation } from "react-i18next";

export type OrderType = "deliverOrder" | "bringOrder";

export interface OrderTypeModalProps {
  isModalOpen: boolean;
  handleOrderType: (type: OrderType) => void;
  handleClose: () => void;
}

const OrderTypeModal = ({ isModalOpen, handleOrderType, handleClose }: OrderTypeModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal title={t("orderActionSelection")} open={isModalOpen} footer={null} onCancel={handleClose}>
      <Title style={{ paddingTop: "12px", color: colors.gray[600] }} level={5}>
        {t("orderQuestion")}
      </Title>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <Flex vertical gap='1rem' style={{ width: "80%" }}>
          <Button block type='primary' shape='round' size='large' onClick={() => handleOrderType("deliverOrder")}>
            {t("deliverOrder")}
          </Button>
          <Button block size='large' shape='round' danger onClick={() => handleOrderType("bringOrder")}>
            {t("bringOrder")}
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};
export default OrderTypeModal;
