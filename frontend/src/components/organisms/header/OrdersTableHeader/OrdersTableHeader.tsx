import { Button, Space } from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import { HiOutlinePlus } from "react-icons/hi";
import "./OrdersTableHeader.scss";
import { useTranslation } from "react-i18next";

interface OrdersTableHeaderProps {
  onSearchChange: (searchedId: string) => void;
  onClickBtn: () => void;
  btnText: string;
}

const OrdersTableHeader = ({ onClickBtn, onSearchChange, btnText }: OrdersTableHeaderProps) => {
  const { t } = useTranslation();

  const onSearch: SearchProps["onSearch"] = (value) => {
    value === "" ? onSearchChange("null") : onSearchChange(value);
  };

  return (
    <div className="orders-container--header-actions">
      <Space size="middle">
        <Search
          className="orders-container--header-actions-search"
          placeholder={t("searchTrackingNumber")}
          allowClear
          onSearch={onSearch}
          style={{ width: 260 }}
        />
        <Button
          onClick={onClickBtn}
          type="primary"
          icon={<HiOutlinePlus />}
        >
          {btnText}
        </Button>
      </Space>
    </div>
  );
};

export default OrdersTableHeader;
