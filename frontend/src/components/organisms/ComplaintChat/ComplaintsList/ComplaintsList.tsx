import React, { useEffect, useState } from "react";
import Search, { SearchProps } from "antd/es/input/Search";
import { Badge, Button, Empty, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
import "./ComplaintsList.scss";
import ComplaintCard from "../ComplainCard/ComplaintCard";
import { Complaint } from "../../../../types/Complaint";
import formatDate from "../../../../services/date";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import { selectedStatistic } from "../../../../features/statistics/statisticsSlice";
import { useSelector } from "react-redux";

interface ComplaintsListProps {
  complaints: Complaint[];
  handleSelectComplaint: (selectComplaint: Complaint) => void;
  onTabChange: (key: string) => void;
  isAdmin: boolean;
  isloading: boolean;
  defaultSelectedComplaintId: number | null;
  loadMoreComplaints: () => void;
  totalCountComplaints: number;
  isLoadMore: boolean;
  onSearchChange: (subject: string) => void;
}

const ComplaintsList: React.FC<ComplaintsListProps> = ({
  complaints,
  handleSelectComplaint,
  isAdmin,
  onTabChange,
  isloading,
  defaultSelectedComplaintId,
  loadMoreComplaints,
  totalCountComplaints,
  isLoadMore,
  onSearchChange,
}) => {
  const { t } = useTranslation();
  const [selectedComplaint, setSelectedComplaint] = useState(defaultSelectedComplaintId);
  const statistics: any = useSelector(selectedStatistic);
  console.log("ADMIN CLAIMS:", complaints);


  useEffect(() => {
    setSelectedComplaint(defaultSelectedComplaintId);
  }, [defaultSelectedComplaintId]);

  const onSelectComplaint = (complaint: Complaint) => {
    handleSelectComplaint(complaint);
    setSelectedComplaint(complaint.id);
  };
  const onSearch: SearchProps["onSearch"] = (value) => {
    value === "" ? onSearchChange("null") : onSearchChange(value);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <div>
          {t("Open")}{" "}
          {statistics?.totalComplaints && statistics?.totalComplaints > 0 ? (
            <Badge count={statistics?.totalComplaints > 99 ? "+99" : statistics?.totalComplaints} />
          ) : null}
        </div>
      ),
      children: (
        <div
          className='complaints-list'
          id='scrollableDiv'
          style={{
            padding: "0 8px",
          }}
        >
        
          {isloading ? (
            <Spin style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }} />
          ) : complaints.length === 0 ? (
            <Empty
              style={{
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            />
          ) : (
            <>
              <Title level={5}>
                {t("Total")}: {totalCountComplaints}
              </Title>
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  id={complaint.id}
                  title={complaint.subject}
                  description={complaint.messages?.[0]?.messageContent}   // ✅ ADD THIS
                  date={formatDate(complaint.createdAt)}
                  onClick={() => onSelectComplaint(complaint)}
                  isSelected={selectedComplaint === complaint.id}
                  status={t("Open")}
                  isAdmin={isAdmin}
                />
              ))}
              <Button disabled={isLoadMore} onClick={loadMoreComplaints} style={{ width: "100%" }}>
                {t("Load more")}
              </Button>
            </>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div>
          {t("Closed")}{" "}
          {statistics?.totalClosedComplaints && statistics?.totalClosedComplaints > 0 ? (
            <Badge count={statistics?.totalClosedComplaints > 99 ? "+99" : statistics?.totalClosedComplaints} />
          ) : null}
        </div>
      ),
      children: (
        <div
          className='complaints-list'
          id='scrollableDiv'
          style={{
            padding: "0 8px",
          }}
        >
          {isloading ? (
            <Spin style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }} />
          ) : complaints.length === 0 ? (
            <Empty
              style={{
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            />
          ) : (
            <>
              <Title level={5}>
                {t("Total")}: {totalCountComplaints}
              </Title>
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  id={complaint.id}
                  title={complaint.subject}
                  date={formatDate(complaint.createdAt)}
                  onClick={() => handleSelectComplaint(complaint)}
                  isSelected={selectedComplaint === complaint.id}
                  status={t("Closed")}
                  isAdmin={isAdmin}
                />
              ))}
              <Button disabled={isLoadMore} onClick={loadMoreComplaints} style={{ width: "100%" }}>
                {t("Load more")}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className='complaints-container'>
      <div className='complaints-search'>
        <Search placeholder={t("Search by subject")} allowClear onSearch={onSearch} />
      </div>
      <div className='complaints-tab-list'>
        <Tabs defaultActiveKey='1' items={items} animated onChange={onTabChange} />
      </div>
    </div>
  );
};

export default ComplaintsList;
