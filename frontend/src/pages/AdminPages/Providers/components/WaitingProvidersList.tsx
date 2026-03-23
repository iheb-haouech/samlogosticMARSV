import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Space, Table, Button, Pagination, Tooltip, Popconfirm } from "antd";
import { HiCheck, HiOutlineTrash } from "react-icons/hi";
import { ApiClientWithHeaders } from "../../../../api";
import { store } from "../../../../store/store";

import {
  selectLimit,
  selectProviders,
  selectTotalCount,
  setFilter,
  setLimit,
  setPage,
  updateProviders,
} from "../../../../features/provider/providerSlice";
import { useTranslation } from "react-i18next";
import Search, { SearchProps } from "antd/es/input/Search";

const WaitingProvidersList: React.FC = () => {
  const { t } = useTranslation();

  const token: any = localStorage.getItem("accessToken");
  const myClient = ApiClientWithHeaders(token);
  const providers = useSelector(selectProviders);
  const providersData = providers?.map((user: any) => {
    return {
      key: user.id,
      name: user.email,
      createdAt: user.createdAt,
      telephone: user.phone,
      patent: user.patent,
      id: user.id,
    };
  });

  // Pagination
  const limit = useSelector(selectLimit);
  const totalProviders = useSelector(selectTotalCount);

  const [pageSizeLimit, setPageSizeLimit] = useState<number>(limit);

  const onPageSizeLimitChange = (_current: number, size: number) => {
    setPageSizeLimit(size);
    store.dispatch(setLimit(size));
  };
  const handlePageChange = (page: number) => {
    store.dispatch(setPage(page));
  };

  const onSearch: SearchProps["onSearch"] = (filtredEmail: string) => {
    store.dispatch(setFilter({ verified: false, filtredEmail }));
  };

  //TODO wrong call of api here we need to handleAcceptUser and handleRejectUser in the store
  const handleAcceptUser = async (id: any) => {
    store.dispatch(updateProviders(id));
    await myClient.user.userControllerVerifieUser(id);
  };
  const handleRejectUser = async (id: any) => {
    store.dispatch(updateProviders(id));
    await myClient.user.userControllerRemove(id);
  };

  const columns: Array<any> = [
    {
      title: t("provider_name"),
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
      title: t("actions"),
      key: "actions",
      width: 160,
      render: (user: any) => {
        return (
          <Space size='middle'>
            <Tooltip title={t("delete")}>
              <Popconfirm title={t("delete_confirmation")} onConfirm={() => handleRejectUser(user.id)}>
                <Button danger shape='round' className='table--action-btn' icon={<HiOutlineTrash />}>
                  {t("reject")}
                </Button>
              </Popconfirm>
            </Tooltip>
            <Button
              shape='round'
              style={styles.successBtn}
              type='default'
              className='table--action-btn'
              icon={<HiCheck />}
              onClick={() => handleAcceptUser(user.id)}
            >
              {t("accept")}
            </Button>
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
            {t("pending_providers_count")} {totalProviders}
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
          dataSource={providersData}
          rowKey='id'
          pagination={false}
          scroll={{ y: tableHeight, x: 700 }}
        />
        <Pagination
          style={{ margin: "26px", textAlign: "right", justifyContent: "flex-end" }}
          pageSize={pageSizeLimit}
          total={totalProviders}
          showSizeChanger
          showTotal={(total, range) => `${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`}
          onChange={handlePageChange}
          onShowSizeChange={onPageSizeLimitChange}
        />
      </div>
    </>
  );
};

export default WaitingProvidersList;
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
