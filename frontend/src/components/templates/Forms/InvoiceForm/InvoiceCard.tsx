import React, { useState } from "react";
import { Card, Typography, Button, Table, Modal } from "antd";
import SelectUserModal from "./SelectUserModal";
import { ApiClientWithHeaders } from "../../../../api";

const { Text } = Typography;

interface InvoiceCardProps {
  data: any[];
  users: any[];
  isloading: boolean;
  loadMoreUsers: () => void;
  isLoadMore: boolean;
  onSearchUserChange: (value: string) => void;
  fetchUsers: () => void;
  setInvoiceData: any;
  currentUserType?: "livreur" | "l'entreprise";
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  data,
  users,
  isloading,
  loadMoreUsers,
  isLoadMore,
  onSearchUserChange,
  fetchUsers,
  setInvoiceData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(false);
  };

  const handleSelectUserClick = () => {
    fetchUsers();
    setIsModalOpen(true);
  };

  const getInvoices = async (userId: string, page: number, pageSize: number) => {
    try {
      const token: any = localStorage.getItem("accessToken");
      const myClient = ApiClientWithHeaders(token);
      const response: any = await myClient.user.userControllerFindUserOrdersInvoices(userId, {
        page,
        limit: pageSize,
      } as any);

      let invoices: any[] = response?.data?.invoices || [];
      setInvoiceData(invoices);
      setPagination((prev) => ({
        ...prev,
        total: invoices.length,
      }));
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleUserSelected = (user: any) => {
    setSelectedUser(user);
    getInvoices(user.id.toString(), pagination.current, pagination.pageSize);
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
    if (selectedUser) {
      getInvoices(selectedUser.id.toString(), newPagination.current, newPagination.pageSize);
    }
  };

  const handleViewDetails = (record: any) => {
    setSelectedInvoice(record);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedInvoice(null);
  };

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "matricule",
      key: "matricule",
    },
    {
      title: "Total HT",
      dataIndex: "totalHt",
      key: "totalHt",
      render: (value: number) => value?.toFixed(2) || "0.00",
    },
    {
      title: "TVA",
      dataIndex: "tva",
      key: "tva",
      render: (value: number) => `${value}%`,
    },
    {
      title: "TTC",
      dataIndex: "ttc",
      key: "ttc",
      render: (value: number) => value?.toFixed(2) || "0.00",
    },
    {
      title: "Timbre Fiscale",
      dataIndex: "timbreFiscale",
      key: "timbreFiscale",
      render: (value: number) => value?.toFixed(2) || "0.00",
    },
    {
      title: "Net",
      dataIndex: "net",
      key: "net",
      render: (value: number) => value?.toFixed(2) || "0.00",
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      render: (text: string) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      render: (text: string) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: any) => (
        <Button type='link' onClick={() => handleViewDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card
        title='Invoices'
        style={{ marginTop: "20px" }}
        extra={<Button onClick={handleSelectUserClick}>Select User</Button>}
      >
        {selectedUser && (
          <div style={{ marginBottom: "20px" }}>
            <Text strong>Selected User:</Text> {selectedUser.firstName} {selectedUser.lastName}
          </div>
        )}
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={handleTableChange}
          loading={isloading}
        />
      </Card>
      <SelectUserModal
        isModalOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        users={users}
        isloading={isloading}
        onSelectUser={handleSelectUser}
        loadMoreUsers={loadMoreUsers}
        isLoadMore={isLoadMore}
        onSearchUserChange={onSearchUserChange}
        onUserSelected={handleUserSelected}
      />
      <Modal title='Invoice Orders Details' open={isDetailsModalOpen} onCancel={handleDetailsModalClose} footer={null}>
        {selectedInvoice &&
          selectedInvoice?.orders?.map((item: any, index: any) => (
            <div key={index}>
              <p>
                <b>TrackingID:</b> {item?.trackingId}
              </p>
            </div>
          ))}
      </Modal>
    </>
  );
};

export default InvoiceCard;
