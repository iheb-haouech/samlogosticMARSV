import { Layout } from "antd";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { store } from "../../../store/store";
import { useEffect, useState } from "react";
import WaitingProvidersList from "./components/WaitingProvidersList";
import ApprovedProvidersList from "./components/ApprovedProvidersList";
import { setFilter } from "../../../features/provider/providerSlice";
import { useTranslation } from "react-i18next";

const ProvidersList: React.FC = () => {
  const [activeTab, setActiveTab] = useState("waiting");
  const { t } = useTranslation();
  const onChange = async (event: any) => {
    const verified = event === "approved" ? true : false;
    setActiveTab(event);
    store.dispatch(setFilter({ verified: verified, filtredEmail: "" }));
  };
  useEffect(() => {
    const verified = activeTab === "approved" ? true : false;
    store.dispatch(setFilter({ verified: verified, filtredEmail: "" }));
  }, []);
  const tabsItems: TabsProps["items"] = [
    {
      key: "waiting",
      label: t("pending_providers"),
      children: <WaitingProvidersList />,
    },
    {
      key: "approved",
      label: t("approved_providers"),
      children: <ApprovedProvidersList />,
    },
  ];
  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Tabs defaultActiveKey={activeTab} items={tabsItems} onChange={onChange} />
    </Layout>
  );
};

export default ProvidersList;
