import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Modal, Checkbox } from "antd";
import "./DeliveryPersonModal.scss";
import { UserOutlined } from "@ant-design/icons";
import { Order } from "../../../../types/Order";
import Search, { SearchProps } from "antd/es/input/Search";
import { useTranslation } from "react-i18next";
export interface DeliveryPersonModalProps {
  isDeliveryPersonModalOpen: boolean;
  onAssignDelivery: (deliveryPersonId: number | null) => void;
  handleClose: () => void;
  deliveryPersons?: any;
  isloading: boolean;
  order?: Order;
  onSearchDeliveryPersonChange: (searchedDeliveruId: string) => void;
}

interface DataType {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  image?: string;
}

const DeliveryPersonModal: React.FC<DeliveryPersonModalProps> = ({
  isDeliveryPersonModalOpen,
  onAssignDelivery,
  deliveryPersons,
  handleClose,
  isloading,
  order,
  onSearchDeliveryPersonChange,
}: DeliveryPersonModalProps) => {
  const { t } = useTranslation();
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  useEffect(() => {
    if (order?.deliveredByUserId !== undefined) {
      setSelectedPerson(order?.deliveredByUserId);
    }
  }, [order]);
  const handleItemClick = (id: number) => {
    setSelectedPerson((prevSelected) => (prevSelected === id ? null : id));
  };
  const onSearch: SearchProps["onSearch"] = (value) => {
    value === "" ? onSearchDeliveryPersonChange("") : onSearchDeliveryPersonChange(value);
  };
  //TODO fetch all delivery persons not the first 10, without pagination
  return (
    <Modal title={t("assignTransporter")} open={isDeliveryPersonModalOpen} footer={null} onCancel={handleClose}>
      <Search
        className='orders-container--header-actions-search'
        placeholder={t("searchTransporter")}
        allowClear
        onSearch={onSearch}
      />
      <div id='scrollableDiv' className='delivery-list-container'>
        <List
          className='demo-loadmore-list'
          loading={isloading}
          itemLayout='horizontal'
          dataSource={deliveryPersons}
          renderItem={(item: DataType) => (
            <List.Item
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={selectedPerson === item.id ? "selected-item" : ""}
              actions={[
                <Checkbox
                  key='select'
                  checked={selectedPerson === item.id}
                  onChange={() => handleItemClick(item.id)}
                  onClick={(e) => e.stopPropagation()} // Prevent triggering the onClick of the List.Item
                />,
              ]}
              style={{ cursor: "pointer" }} // To indicate that the list item is clickable
            >
              <List.Item.Meta
                style={{ padding: "0 10px" }}
                avatar={<Avatar src={item?.image} icon={<UserOutlined />} />}
                title={item.firstName + " " + item.lastName}
                description={"Phone: " + item.phone}
              />
            </List.Item>
          )}
        />
      </div>
      <div className='delivery-list-btns'>
        <Button
          type='primary'
          onClick={() => {
            // if (selectedPerson !== null) {
            onAssignDelivery(selectedPerson);
            // }
          }}
          // disabled={selectedPerson === null}
        >
          {t("assignTransporter")}
        </Button>
        <Button
          danger
          onClick={() => {
            setSelectedPerson(null);
            handleClose();
          }}
        >
          {t("cancel")}
        </Button>
      </div>
    </Modal>
  );
};

export default DeliveryPersonModal;
