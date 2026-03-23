import React, { useState, useEffect } from "react";
import { Tabs, TabsProps } from "antd";
import InvoiceForm from "../../../components/templates/Forms/InvoiceForm/InvoiceForm";
import { store } from "../../../store/store";
import {
  selectLoadMoreLimit as selectLoadMoreTransportersLimit,
  setLoadMoreTransporter,
  selectTotalCount as selectTotalCountTransporters,
  fetchTransportersLoadMore,
  selectTransportersLoadMore,
  selectStatus as transportersStatus,
} from "../../../features/transporter/transporterSlice";
import {
  selectLoadMoreLimit as selectLoadMoreProvidersLimit,
  fetchProvidersLoadMore,
  setLoadMoreProviders,
  selectTotalCount as selectTotalCountProviders,
  selectProvidersLoadMore,
  selectStatus as selectProvidersStatus,
} from "../../../features/provider/providerSlice";
import { useSelector } from "react-redux";
import DisplayUsersListModal from "../../../components/molecules/Modals/DisplayUsersListModal/DisplayUsersListModal";
import { generateProviderFacture } from "../../../services/generate_pdf";
import { useTranslation } from "react-i18next";
import InvoiceCard from "../../../components/templates/Forms/InvoiceForm/InvoiceCard";
import "./Invoices.css"; // Import the CSS file

const Invoices: React.FC = () => {
  const { t } = useTranslation();
  const [isUsersListModalOpen, setIsUsersListModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [currentUserType, setCurrentUserType] = useState<"livreur" | "l'entreprise">("l'entreprise");
  const [invoiceData, setInvoiceData] = useState([]);

  const transporters = useSelector(selectTransportersLoadMore);
  const _transportersStatus = useSelector(transportersStatus);
  const loadMoreTransportersLimit = useSelector(selectLoadMoreTransportersLimit);
  const totalCountTransporters = useSelector(selectTotalCountTransporters);

  const providers = useSelector(selectProvidersLoadMore);
  const providersStatus = useSelector(selectProvidersStatus);
  const loadMoreProvidersLimit = useSelector(selectLoadMoreProvidersLimit);
  const totalCountProviders = useSelector(selectTotalCountProviders);

  const onLoadMoreTransporter = () => {
    store.dispatch(setLoadMoreTransporter(loadMoreTransportersLimit + 5));
  };

  const onLoadMoreProviders = () => {
    store.dispatch(setLoadMoreProviders(loadMoreProvidersLimit + 5));
  };

  const handleSelectUserToGenerateInvoice = (selectedUser: any | null) => {
    setSelectedUser(selectedUser);
    setIsUsersListModalOpen(false);
  };

  const handleTabChange = (key: string) => {
    setCurrentUserType(key === "1" ? "l'entreprise" : "livreur");
  };

  useEffect(() => {
    setSelectedUser(null);
    setInvoiceData([]);
  }, [currentUserType]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("provider_invoice"),
      children: (
        <>
          <InvoiceForm
            userType="l'entreprise"
            invoiceType={3}
            selectedUser={selectedUser}
            onGenerateInvoice={(values: any) => {
              if (selectedUser)
                generateProviderFacture(selectedUser.id.toString(), values.from, values.to, values?.invoiceType);
              setSelectedUser(null);
            }}
            isAdmin={true}
            onSelectUserToGenerateInvoice={() => {
              store.dispatch(fetchProvidersLoadMore());
              setIsUsersListModalOpen(true);
            }}
            setInvoiceData={setInvoiceData}
          />
          <DisplayUsersListModal
            userType="l'entreprise"
            users={providers}
            handleClose={() => setIsUsersListModalOpen(false)}
            isloading={providersStatus === "loading"}
            isDisplayUsersListModalOpen={isUsersListModalOpen && currentUserType === "l'entreprise"}
            onSelectUser={handleSelectUserToGenerateInvoice}
            loadMoreUsers={onLoadMoreProviders}
            isLoadMore={totalCountProviders <= loadMoreProvidersLimit}
            onSearchUserChange={(value: any) => console.log(value)}
          />
        </>
      ),
    },
    {
      key: "2",
      label: t("transporter_invoice"),
      children: (
        <>
          <InvoiceForm
            userType='livreur'
            invoiceType={4}
            selectedUser={selectedUser}
            onGenerateInvoice={(values: any) => {
              if (selectedUser)
                generateProviderFacture(selectedUser.id.toString(), values.from, values.to, values?.invoiceType);
              setSelectedUser(null);
            }}
            isAdmin={true}
            onSelectUserToGenerateInvoice={() => {
              store.dispatch(fetchTransportersLoadMore());
              setIsUsersListModalOpen(true);
            }}
            setInvoiceData={setInvoiceData}
          />
          <DisplayUsersListModal
            users={transporters}
            handleClose={() => setIsUsersListModalOpen(false)}
            isloading={_transportersStatus === "loading"}
            isDisplayUsersListModalOpen={isUsersListModalOpen && currentUserType === "livreur"}
            onSelectUser={handleSelectUserToGenerateInvoice}
            loadMoreUsers={onLoadMoreTransporter}
            isLoadMore={totalCountTransporters <= loadMoreTransportersLimit}
            onSearchUserChange={(value: any) => console.log(value)}
            userType='livreur'
          />
        </>
      ),
    },
  ];

  return (
    <div className='scrollable-content'>
      <div>
        <Tabs defaultActiveKey='1' items={items} onChange={handleTabChange} />
      </div>
      <InvoiceCard
        data={invoiceData}
        users={currentUserType === "l'entreprise" ? providers : transporters}
        isloading={
          currentUserType === "l'entreprise" ? providersStatus === "loading" : _transportersStatus === "loading"
        }
        loadMoreUsers={currentUserType === "l'entreprise" ? onLoadMoreProviders : onLoadMoreTransporter}
        isLoadMore={
          currentUserType === "l'entreprise"
            ? totalCountProviders <= loadMoreProvidersLimit
            : totalCountTransporters <= loadMoreTransportersLimit
        }
        onSearchUserChange={(value) => console.log("ccccccccc", value)}
        fetchUsers={
          currentUserType === "l'entreprise"
            ? () => store.dispatch(fetchProvidersLoadMore())
            : () => store.dispatch(fetchTransportersLoadMore())
        }
        setInvoiceData={setInvoiceData}
        currentUserType={currentUserType}
      />
    </div>
  );
};

export default Invoices;
