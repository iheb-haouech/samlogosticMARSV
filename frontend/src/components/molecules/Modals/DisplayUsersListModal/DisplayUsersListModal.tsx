import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Modal, Checkbox } from "antd";
import "./DisplayUsersListModal.scss";
import { UserOutlined } from "@ant-design/icons";

export interface DeliveryPersonModalProps {
  isDisplayUsersListModalOpen: boolean;
  onSelectUser: (user: any | null) => void;
  handleClose: () => void;
  users?: any[];
  isloading: boolean;
  oldSelectedUser?: any | null;
  onSearchUserChange?: (searchedUserName: string) => void;
  loadMoreUsers: () => void;
  isLoadMore: boolean;
  userType: "livreur" | "l'entreprise";
}

const DisplayUsersListModal: React.FC<DeliveryPersonModalProps> = ({
  isDisplayUsersListModalOpen,
  onSelectUser,
  users,
  handleClose,
  isloading,
  oldSelectedUser,
  loadMoreUsers,
  isLoadMore,
  userType,
}: DeliveryPersonModalProps) => {
  const [selectedUser, setSelectedUser] = useState<any | null>(oldSelectedUser || null);

  useEffect(() => {
    setSelectedUser(oldSelectedUser ?? null);
  }, [oldSelectedUser]);

  const handleItemClick = (user: any) => {
    setSelectedUser((prevSelected: any) => (prevSelected?.id === user.id ? null : user));
  };

  // const onSearch: SearchProps["onSearch"] = (value) => {
  //   onSearchUserChange(value || "");
  // };

  return (
    <Modal title='Sélectionner ' open={isDisplayUsersListModalOpen} footer={null} onCancel={handleClose}>
      {/* <Search
        className='orders-container--header-actions-search'
        placeholder='Chercher avec nom '
        allowClear
        onSearch={onSearch}
      /> */}
      <div id='scrollableDiv' className='delivery-list-container'>
        <List
          className='demo-loadmore-list'
          loading={isloading}
          itemLayout='horizontal'
          dataSource={users}
          renderItem={(item: any) => (
            <List.Item
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={selectedUser?.id === item.id ? "selected-item" : ""}
              actions={[
                <Checkbox
                  key={item.id}
                  checked={selectedUser?.id === item.id}
                  onChange={() => handleItemClick(item)}
                  onClick={(e) => e.stopPropagation()} // Prevent triggering the onClick of the List.Item
                />,
              ]}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                style={{ padding: "0 10px" }}
                avatar={<Avatar src={item?.image} icon={<UserOutlined />} />}
                title={userType === "livreur" ? `${item.firstName} ${item.lastName}` : item.companyName}
                description={userType === "livreur" ? `Phone:  ${item.phone}` : `Email:  ${item.email}`}
              />
            </List.Item>
          )}
        />
        <div
          style={{
            textAlign: "center",
            margin: "1rem",
          }}
        >
          <Button disabled={isLoadMore} onClick={loadMoreUsers}>
            Load more
          </Button>
        </div>
      </div>
      <div className='delivery-list-btns'>
        <Button
          type='primary'
          onClick={() => {
            onSelectUser(selectedUser);
          }}
        >
          sélectionner
        </Button>
        <Button
          danger
          onClick={() => {
            setSelectedUser(null);
            handleClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default DisplayUsersListModal;
