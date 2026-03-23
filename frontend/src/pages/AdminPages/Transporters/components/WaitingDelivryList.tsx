import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Pagination, Popconfirm } from "antd";
import { ApiClientWithHeaders } from "../../../../api";
import { store } from "../../../../store/store";
import {
  selectLimit,
  selectTotalCount,
  selectTransporters,
  setFilter,
  setLimit,
  setPage,
  updateTransporters,
} from "../../../../features/transporter/transporterSlice";
import Search, { SearchProps } from "antd/es/input/Search";
import { useTranslation } from "react-i18next";

const WaitingDelivryList: React.FC = () => {
  const { t } = useTranslation();
  const token: any = localStorage.getItem("accessToken");
  const myClient = ApiClientWithHeaders(token);
  const transporters = useSelector(selectTransporters);
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

  const onSearch: SearchProps["onSearch"] = (filtredFirstName: string) => {
    store.dispatch(setFilter({ verified: false, filtredFirstName }));
  };

  //TODO wrong call of api here we need to handleAcceptUser and handleRejectUser in the store

  const handleAcceptUser = async (id: any) => {
    store.dispatch(updateTransporters(id));
    await myClient.user.userControllerVerifieUser(id);
  };
  const handleRejectUser = async (id: any) => {
    store.dispatch(updateTransporters(id));
    await myClient.user.userControllerRemove(id);
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
      render: (user: any) => {
        return (
          <div style={{ display: "flex", gap: "4px" }}>
            <Popconfirm title={t("confirm_reject")} onConfirm={() => handleRejectUser(user.id)}>
              <Button danger shape='round' className='table--action-btn'>
                {t("reject")}
              </Button>
            </Popconfirm>
            <Button
              shape='round'
              style={styles.successBtn}
              type='default'
              className='table--action-btn'
              onClick={() => handleAcceptUser(user.id)}
            >
              {t("accept")}
            </Button>
          </div>
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
            {t("waiting_deliverers_count")}
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
          columns={columns}
          dataSource={transportersData}
          rowKey='id'
          pagination={false}
          scroll={{ y: tableHeight, x: 900 }}
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
    </>
  );
};

export default WaitingDelivryList;
const styles = {
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "30px 0 20px 0",
  },
  successBtn: {
    borderColor: "green",
    color: "green",
  },
};
