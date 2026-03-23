import React from "react";
import { Modal, List, Avatar, Typography, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface SelectUserModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  users: any[];
  isloading: boolean;
  onSelectUser: (user: any) => void;
  loadMoreUsers: () => void;
  isLoadMore: boolean;
  onSearchUserChange: (value: string) => void;
  onUserSelected: (user: any) => void; // Add this prop
}

const SelectUserModal: React.FC<SelectUserModalProps> = ({
  isModalOpen,
  handleClose,
  users,
  isloading,
  onSelectUser,
  loadMoreUsers,
  isLoadMore,
  onSearchUserChange,
  onUserSelected, // Destructure the new prop
}) => {
  const handleUserClick = (user: any) => {
    onSelectUser(user);
    onUserSelected(user); // Call the new function when a user is selected
    handleClose();
  };

  return (
    <Modal title='Select User' open={isModalOpen} onCancel={handleClose} footer={null} width={600}>
      <Input.Search
        placeholder='Search user'
        onChange={(e) => onSearchUserChange(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <List
        loading={isloading}
        dataSource={users}
        renderItem={(user) => (
          <List.Item key={user.id} onClick={() => handleUserClick(user)} style={{ cursor: "pointer" }}>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <Text strong>
                  {user.firstName} {user.lastName} {user.id}
                </Text>
              }
              description={user.companyName || user.email}
            />
          </List.Item>
        )}
      />
      {isLoadMore && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={loadMoreUsers} disabled={isloading}>
            Load More
          </button>
        </div>
      )}
    </Modal>
  );
};

export default SelectUserModal;
