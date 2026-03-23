import React from "react";
import { Avatar, Button, Popconfirm } from "antd";
import "./MessageSectionHeader.scss";
import { Typography } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import colors from "../../../../styles/colors/colors";
const { Text } = Typography;
interface MessageSectionHeaderProps {
  isAdmin: boolean;
  companyName?: string;
  companyImage?: string;
  trackingNumber: string;
  onDelete: () => void;
  onResolve: () => void;
  viewOrderDetails: () => void;
  status: "1" | "3"; // 1 for open and 2 for closed
}

const MessageSectionHeader: React.FC<MessageSectionHeaderProps> = ({
  isAdmin,
  companyName,
  companyImage,
  trackingNumber,
  onDelete,
  onResolve,
  viewOrderDetails,
  status,
}) => {
  return (
    <div className='header-component'>
      {isAdmin ? (
        <div className='header-component__admin'>
          <div className='header-component__admin-company'>
            <Avatar src={companyImage} style={{ backgroundColor: colors.secondary[200] }} icon={<UserOutlined />} />
            <h3>{companyName ? companyName : "Company Name"}</h3>
          </div>
          <div className='company-details'>
            {status === "1" && (
              <Popconfirm
                title='Mark it as resolved'
                description='Are you sure you want to mark this item as resolved?'
                onConfirm={onResolve}
                okText='Yes'
                cancelText='No'
              >
                <Button className='green-button' icon={<CheckOutlined />}></Button>
              </Popconfirm>
            )}

            <Button onClick={viewOrderDetails} icon={<EyeOutlined />} danger>
              Voir les détails de commande
            </Button>
          </div>
        </div>
      ) : (
        <div className='header-component__user'>
          <div className='header-info'>
            <div className='trackingNumber'>
              <Text>Tracking Number:</Text>
              <Paragraph className='trackingNumberText' copyable>
                {trackingNumber ? trackingNumber : "--"}
              </Paragraph>
            </div>
          </div>
          <div className='header-actions'>
            <Popconfirm
              title='Delete the complaint'
              description='Are you sure to delete this complaint?'
              onConfirm={onDelete}
              okText='Yes'
              cancelText='No'
            >
              <Button icon={<DeleteOutlined />} danger>
                Delete
              </Button>
            </Popconfirm>
            {status === "1" && (
              <Popconfirm
                title='Mark it as resolved'
                description='Are you sure you want to mark this item as resolved?'
                onConfirm={onResolve}
                okText='Yes'
                cancelText='No'
              >
                <Button className='green-button' icon={<CheckOutlined />}>
                  Mark it as resolved
                </Button>
              </Popconfirm>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSectionHeader;
