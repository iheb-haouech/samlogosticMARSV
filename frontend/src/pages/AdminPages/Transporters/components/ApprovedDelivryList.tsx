import React, { useLayoutEffect, useRef, useState } from "react";
import { Space, Table, Button, Drawer, Pagination, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi";
import { store } from "../../../../store/store";
import { ApiClientWithHeaders } from "../../../../api";
import TransporterInfo from "./TransporterInfo/TransporterInfo";
import {
  selectLimit,
  selectTotalCount,
  selectTransporters,
  setFilter,
  setLimit,
  setPage,
  updateTransporters,
} from "../../../../features/transporter/transporterSlice";
import { useTranslation } from "react-i18next";
import Search, { SearchProps } from "antd/es/input/Search";

const ApprovedDelivryList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const transporters = useSelector(selectTransporters);

  const { t } = useTranslation();
  const token: any = localStorage.getItem("accessToken");
  const myClient = ApiClientWithHeaders(token);
  const [selectedTransporterId, setSelectedTransporterId] = useState("");
  const transportersData = transporters?.map((user: any) => {
    return {
      key: user.id,
      name: user.email,
      createdAt: user.createdAt,
      telephone: user.phone,
      patent: user.patent,
      VehicleType: user?.carType?.typeName,
      id: user.id,
    };
  });

  // Pagination
  const limit = useSelector(selectLimit);
  const totalTransporters = useSelector(selectTotalCount);

  const [pageSizeLimit, setPageSizeLimit] = useState<number>(limit);

  const onPageSizeLimitChange = (_current: number, size: number) => {
    setPageSizeLimit(size);
    store.dispatch(setLimit(size));
  };

  const handlePageChange = (page: number) => {
    store.dispatch(setPage(page));
  };

  const handleDeleteUser = async (id: any) => {
    store.dispatch(updateTransporters(id));
    //TODO wrong call of api here we need to handleDeleteUser in the store
    await myClient.user.userControllerRemove(id);
  };

  const showDrawer = (id: string) => {
    setOpen(true);
    setSelectedTransporterId(id);
  };

  const onSearch: SearchProps["onSearch"] = (filtredFirstName: string) => {
    store.dispatch(setFilter({ verified: true, filtredFirstName }));
  };
  const onClose = () => {
    setOpen(false);
  };
  const columns: Array<any> = [
    {
      title: t("deliverer_name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("registration_date"),
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: t("phone_number"),
      dataIndex: "telephone",
      key: "telephone",
    },
    {
      title: t("patent"),
      dataIndex: "patent",
      key: "patent",
    },
    {
      title: t("vehicle_type"),
      dataIndex: "VehicleType",
      key: "VehicleType",
    },
    {
      title: t("action"),
      key: "actions",
      width: 100,
      render: (user: any) => {
        return (
          <Space>
            <Button
              style={styles.primaryBtn}
              onClick={() => showDrawer(user.id)}
              className='table--action-btn'
              icon={<HiOutlineEye />}
            />
            <Popconfirm title={t("confirm_delete")} onConfirm={() => handleDeleteUser(user.id)}>
              <Button danger className='table--action-btn' style={{ border: "none" }} icon={<HiOutlineTrash />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const [tableHeight, setTableHeight] = useState(300);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const { top } = ref.current.getBoundingClientRect();
      // Adjust TABLE_HEADER_HEIGHT according to your actual header height.
      const TABLE_HEADER_HEIGHT = 55;
      setTableHeight(window.innerHeight - top - TABLE_HEADER_HEIGHT - 100);
    }
  }, [ref]);
  return (
    <>
      <div style={styles.tableHeader}>
        <div>
          <b>
            Nombre des livreurs:
            {totalTransporters}
          </b>
        </div>
        <Search
          placeholder={t("Search_by_email")}
          allowClear
          onSearch={onSearch}
          style={{ width: 200, minWidth: "290px" }}
        />
      </div>
      <div ref={ref} style={{ height: "100%", overflow: "auto" }}>
        <Table
          // loading={status == "loading"} //TODO
          scroll={{ y: tableHeight, x: 900 }}
          columns={columns}
          dataSource={transportersData}
          rowKey='id'
          pagination={false}
        />
        <Pagination
          style={{ margin: "26px", textAlign: "right", justifyContent: "flex-end" }}
          pageSize={pageSizeLimit}
          total={totalTransporters}
          showSizeChanger
          showTotal={(total, range) => `${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`}
          onChange={handlePageChange}
          onShowSizeChange={onPageSizeLimitChange}
        />
      </div>

      <Drawer title='Informations sur le livreur' onClose={onClose} open={open} size={"large"}>
        <TransporterInfo id={selectedTransporterId} />
      </Drawer>
    </>
  );
};

export default ApprovedDelivryList;

const styles = {
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "30px 0 20px 0",
  },
  primaryBtn: {
    borderColor: "#3779FB",
    color: "#3779FB",
    border: "none",
  },
};
