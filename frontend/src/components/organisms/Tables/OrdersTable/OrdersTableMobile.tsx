import { Card, Button, Space, Divider } from 'antd';
import { HiOutlineEye } from 'react-icons/hi';
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import formatDate from '../../../../services/date';
import OrderStatusTag from '../../../atoms/orderStatusTag/OrderStatusTag';

interface OrdersTableMobileProps {
  orders: any[];
  orderStatuses: any[];
  onViewOrder: (order: any) => void;
}

const OrdersTableMobile = ({ orders, orderStatuses, onViewOrder }: OrdersTableMobileProps) => {
  return (
    <div style={{ padding: '12px', background: '#f5f5f5', minHeight: '100vh' }}>
      {orders.map((order, index) => (
        <Card 
          key={order.id}
          style={{ 
            marginBottom: 16, 
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Numéro + Statut */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0d2c58' }}>
              #{index + 1}
            </span>
            <OrderStatusTag 
              orderStatuses={orderStatuses} 
              orderStatusId={order.orderStatusId} 
            />
          </div>

          {/* Tracking ID */}
          <div style={{ fontSize: 12, color: '#666', marginBottom: 12, fontFamily: 'monospace' }}>
            {order.trackingId?.slice(0, 12)}...{order.trackingId?.slice(-4)}
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* Infos */}
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <CalendarOutlined style={{ color: '#5890cc', fontSize: 16 }} />
              <span style={{ fontSize: 14 }}>{formatDate(order.createdAt)}</span>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <EnvironmentOutlined style={{ color: '#5890cc', fontSize: 16 }} />
              <div style={{ fontSize: 14 }}>
                <div><strong>De:</strong> {order.sender?.companyName || 'N/A'}</div>
                <div style={{ marginTop: 4 }}><strong>Vers:</strong> {order.recipient?.companyName || 'N/A'}</div>
              </div>
            </div>
          </Space>

          {/* Bouton */}
          <Button
            type="primary"
            block
            size="large"
            icon={<HiOutlineEye />}
            onClick={() => onViewOrder(order)}
            style={{ marginTop: 16, height: 48, fontSize: 16, fontWeight: 600, borderRadius: 8 }}
          >
            Voir détails
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default OrdersTableMobile;
