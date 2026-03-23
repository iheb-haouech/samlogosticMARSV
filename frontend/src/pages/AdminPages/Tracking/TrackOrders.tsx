import React, { useEffect, useState } from "react";
import { Button, Card, Col, Input, List, Pagination, Row, Tag, Tooltip, message } from "antd";
import { useSelector } from "react-redux";
import {
  fetchOrderStatuses,
  fetchOrders,
  selectOrders,
  selectcount,
  setFilter,
  setPage,
} from "../../../features/order/orderSlice";
import { store } from "../../../store/store";
import colors from "../../../styles/colors/colors";
import { DropboxOutlined } from "@ant-design/icons";
import "./tracking_style.scss";
import copyToClipboard from "../../../services/copy";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import { getStatusColor, getOrderStatusName } from "../../../services/order_status";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useTranslation } from "react-i18next";

const { Search } = Input;

const TrackOrders: React.FC = () => {
  const { t } = useTranslation();
  // State for search query and clicked item
  const [queryUUID, setQueryUUID] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectcount);

  useEffect(() => {
    // set page 1 by default on mount component
    setCurrentPage(currentPage);
    store.dispatch(setPage(currentPage));
    // fetch all orders on mount component
    store.dispatch(fetchOrderStatuses());
    store.dispatch(fetchOrders());
  }, []);

  // Handle click event for list item
  const handleItemClick = (id: string) => {
    setClickedItem(id);
    alert(`Order ID: ${id}`);
  };

  const handleUUidSearchFIlterChange = (page: any) => {
    const uuid = queryUUID == "" ? "null" : queryUUID;
    setCurrentPage(page);
    store.dispatch(setFilter(uuid));
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    store.dispatch(setPage(page));
  };

  // const cardHeight = "600px";

  return (
    <>
      <Row>
        <Card
          title={
            <Search
              placeholder='Search orders by UUID'
              onChange={(e: any) => setQueryUUID(e?.target.value)}
              style={{ width: "100%" }}
              onSearch={handleUUidSearchFIlterChange}
              size='large'
            />
          }
          style={{ width: "40%" }}
          bodyStyle={{ height: 400, overflowY: "scroll" }}
          actions={[
            <Pagination
              style={{ textAlign: "right", marginRight: "10px" }}
              pageSize={12}
              total={totalOrders}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              onChange={handlePageChange}
            />,
          ]}
        >
          <List
            dataSource={orders}
            renderItem={(order: any) => {
              const isClicked = clickedItem === order?.id;

              return (
                <List.Item
                  key={order?.id}
                  onClick={() => handleItemClick(order?.id)}
                  className='track-orders-list'
                  style={{
                    border: isClicked ? `2px solid ${colors.primary[100]}` : "2px solid #f0f0f0",
                  }}
                >
                  <Row style={{ width: "100%", alignItems: "center" }}>
                    <Col span={3} style={{ textAlign: "center" }}>
                      <DropboxOutlined style={{ color: colors?.primary[300] }} />
                    </Col>
                    <Col span={16} style={{ textAlign: "left" }}>
                      <div>Numéro de suivi: </div>
                      <div style={{ fontWeight: "700" }}>
                        {order?.id?.slice(0, 8)}...{order?.id?.slice(order?.id?.length - 8, order?.id?.length)}
                        <Tooltip title={t("copy")}>
                          <Button
                            onClick={() => {
                              copyToClipboard(order?.id);
                              message.success(`Numéro de suivi ${order?.id} copié avec succès.`, 1.5);
                            }}
                            size='small'
                            style={{ marginLeft: "5px" }}
                            className='table--action-btn'
                            icon={<HiOutlineClipboardCopy />}
                          />
                        </Tooltip>
                      </div>
                    </Col>
                    <Col span={5} style={{ textAlign: "left" }}>
                      <Tag color={getStatusColor(order?.orderStatusId)}>{getOrderStatusName(order?.orderStatusId)}</Tag>
                    </Col>
                  </Row>
                </List.Item>
              );
            }}
          />
        </Card>

        {/*  Map : https://medium.com/@ujjwaltiwari2/a-guide-to-using-openstreetmap-with-react-70932389b8b1 */}
        <div style={{ width: "60%", padding: "10px" }}>
          <MapContainer
            style={{ width: "100wh", height: "500px" }}
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={[51.505, -0.09]}>
              <Popup>This is a popup</Popup>
            </Marker>
          </MapContainer>
        </div>
      </Row>
      <Row>
        <Col span={10} style={{ textAlign: "left" }}>
          aaaaa
        </Col>
        <Col span={14} style={{ textAlign: "left" }}>
          cccccccc
        </Col>
      </Row>
    </>
  );
};

export default TrackOrders;
