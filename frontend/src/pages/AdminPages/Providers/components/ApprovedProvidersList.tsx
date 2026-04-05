import React, { useLayoutEffect, useRef, useState, useEffect  } from "react";
import { Space, Table, Button, Drawer, Pagination, Popconfirm, Tooltip } from "antd";
import { useSelector } from "react-redux";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi";
import { store } from "../../../../store/store";
import { ApiClientWithHeaders } from "../../../../api";

import {
  selectLimit,
  selectProviders,
  selectTotalCount,
  setFilter,
  setLimit,
  setPage,
  updateProviders,
} from "../../../../features/provider/providerSlice";
import ProviderInfo from "./ProviderInfo/ProviderInfo";
import { useTranslation } from "react-i18next";
import Search, { SearchProps } from "antd/es/input/Search";

const ApprovedProvidersList: React.FC = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const providers = useSelector(selectProviders);

  const token: any = localStorage.getItem("accessToken");
  const myClient = ApiClientWithHeaders(token);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await myClient.user.userControllerFindAll();

        console.log("PROVIDERS API:", res);

        store.dispatch(setFilter({ verified: true }as any));
        store.dispatch(updateProviders(res.data)); // ⚠️ important
      } catch (err) {
        console.error("Error fetching providers", err);
      }
    };

    fetchProviders();
  }, []);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const providersData = providers?.map((user: any) => {
    return {
      key: user.id,
      name: user.fullName || user.email,
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
  //TODO wrong call of api here we need to handleDeleteUser  in the store
  const handleDeleteUser = async (id: any) => {
    store.dispatch(updateProviders(id));
    await myClient.user.userControllerRemove(id);
  };

  const showDrawer = (id: string) => {
    setOpen(true);
    setSelectedProviderId(id);
  };

  const onSearch: SearchProps["onSearch"] = (filtredEmail: string) => {
    store.dispatch(setFilter({ verified: true, filtredEmail }));
  };
  const onClose = () => {
    setOpen(false);
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
            <Button
              style={styles.primaryBtn}
              onClick={() => showDrawer(user.id)}
              className='table--action-btn'
              icon={<HiOutlineEye />}
            />
            <Tooltip title={t("delete")}>
              <Popconfirm title={t("delete_confirmation")} onConfirm={() => handleDeleteUser(user.id)}>
                <Button danger className='table--action-btn' style={{ border: "none" }} icon={<HiOutlineTrash />} />
              </Popconfirm>
            </Tooltip>
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
            {t("number_of_providers")} {totalProviders}
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

      <Drawer title={t("provider_info_title")} onClose={onClose} open={open} size={"large"}>
        <ProviderInfo id={selectedProviderId} />
      </Drawer>
    </>
  );
};

export default ApprovedProvidersList;

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
