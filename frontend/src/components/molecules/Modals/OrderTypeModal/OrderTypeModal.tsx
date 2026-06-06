import { Button, Flex, Modal } from "antd";
import Title from "antd/es/typography/Title";
import colors from "../../../../styles/colors/colors";

export type MainOrderType = "international" | "national" | "quote";

export interface OrderTypeModalProps {
  isModalOpen: boolean;
  handleOrderType: (type: MainOrderType) => void;
  handleClose: () => void;
}

const OrderTypeModal = ({ isModalOpen, handleOrderType, handleClose }: OrderTypeModalProps) => {
  return (
    <Modal title="Selection du type de commande" open={isModalOpen} footer={null} onCancel={handleClose} destroyOnClose>
      <Title style={{ paddingTop: "12px", color: colors.gray[600] }} level={5}>
        Vous voulez creer une commande nationale, internationale ou une demande de devis ?
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
            Demande devis
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};

export default OrderTypeModal;
