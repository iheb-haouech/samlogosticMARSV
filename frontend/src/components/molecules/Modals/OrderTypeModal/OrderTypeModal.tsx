import { Button, Flex, Modal } from "antd";
import Title from "antd/es/typography/Title";
import colors from "../../../../styles/colors/colors";
import { useTranslation } from "react-i18next";

export type MainOrderType = "international" | "national" | "quote";

export interface OrderTypeModalProps {
  isModalOpen: boolean;
  handleOrderType: (type: MainOrderType) => void;
  handleClose: () => void;
}

const OrderTypeModal = ({ isModalOpen, handleOrderType, handleClose }: OrderTypeModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal title={t("selectOrderType")} open={isModalOpen} footer={null} onCancel={handleClose} destroyOnClose>
      <Title style={{ paddingTop: "12px", color: colors.gray[600] }} level={5}>
        {t("createOrderQuestion")}
      </Title>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <Flex vertical gap="1rem" style={{ width: "80%" }}>
          <Button block type="primary" shape="round" size="large" onClick={() => handleOrderType("international")}>
            International
          </Button>
          <Button block size="large" shape="round" danger onClick={() => handleOrderType("national")}>
            National
          </Button>
          <Button block size="large" shape="round" onClick={() => handleOrderType("quote")}>
            {t("quoteRequest")}
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};

export default OrderTypeModal;
