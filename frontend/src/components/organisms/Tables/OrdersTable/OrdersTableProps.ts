import { Order, OrderStatus } from "../../../../types/Order";

export interface OrdersTableProps {
  orders: Order[];
  totalOrders: number;
  status: "idle" | "loading" | "failed";
  limitOrdersPerPage: number;
  isAdmin: boolean;
  orderStatuses: OrderStatus[];
  onPageChange: (page: number) => void;
  handlePageSizeChange: (current: number, pageSize: number) => void;
  onUpdateOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  onViewOrder: (order: Order) => void;
  onChangeOrderState: (orderId: any, orderStatusId: any) => void;
  onAssignDeliveryPerson: (order: Order) => void;
  handleOrderStatusFilter: (orderStatusId: string) => void;
  onTogglePayment?: (orderId: string) => void;
  onMarkPaid?: (orderId: string) => void;
}
