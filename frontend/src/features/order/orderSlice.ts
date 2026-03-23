import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiClientWithHeaders, apiClient } from "../../api";
import { OrderDtoResponse, ResponseDto } from "../../api/myApi";
import { AppThunk, RootState, store as ReduxStore } from "../../store/store";

import { triggerAlert } from "../../Alert/alertModule";
import { setLoading } from "../loading/loadingSlice";
import { Order, OrderStatus } from "../../types/Order";
import axios from 'axios';


interface OrderState {
  orders: Order[];
  count: number;
  status: "idle" | "loading" | "failed";
  error?: string;
  page: number;
  limit: number;
  filtredUuid: string;
  orderStatus: OrderStatus[];
  filtredStatus: any;
  fetchedOrder?: Partial<Order>;
}
const initialState: OrderState = {
  page: 1,
  limit: 10,
  filtredUuid: "null",
  filtredStatus: "null",
  orderStatus: [],
  orders: [],
  count: 0,
  status: "idle",
  fetchedOrder: undefined,
};
export const fetchOrderStatuses = createAsyncThunk<OrderStatus[]>("orderStatuses/fetch", async () => {
  try {
    const response = await apiClient.orderStatusesList.appControllerGetOrderStatuses();
    const responseData: any = response.data;
    return responseData.order_statuses;
  } catch (error: any) {
    throw error;
  }
});
export const fetchOrders = createAsyncThunk<{ orders: Order[] | any; count: number }>(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      const response = await myClient.orders.ordersControllerFindAll({
        page: state.orders.page.toString(),
        limit: state.orders.limit.toString(),
        trackingId: state.orders.filtredUuid,
        status: state.orders.filtredStatus,
      } as any);
      return { orders: response.data.orders as Partial<Order>[], count: response.data.totalCount };
    } catch (error: any) {
      triggerAlert({
        type: "deleted",
        title: "Error",
        message: error.response.data.message,
      });
      throw error;
    }
  },
);

export const fetchOrdersByTransporter = createAsyncThunk<
  { orders: Order[] | any; count: number },
  { transporterId: string }
>("orders/fetchOrdersByTransporter", async ({  }) => {
  try {
    const token = localStorage.getItem("accessToken")!;
    const myClient = ApiClientWithHeaders(token);

    // 1ère version: on réutilise le même endpoint que fetchOrders
    // mais avec un filtre supplémentaire.
    // A ADAPTER selon ce que le backend attend.
    const response = await myClient.orders.ordersControllerFindAll({
      page: "1",
      limit: "100",
      status: "null",
      trackingId: "null",
    } as any);

    return {
      orders: response.data.orders as Partial<Order>[],
      count: response.data.totalCount,
    };
  } catch (error: any) {
    triggerAlert({
      type: "deleted",
      title: "Error",
      message: error.response?.data?.message || "Something went wrong",
    });
    throw error;
  }
});



export const getOrderById = createAsyncThunk<{ order: Partial<Order> }, any>(
  "orders/getOrderById",
  async (orderId: any) => {
    try {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      const response = await myClient.orders.ordersControllerFindOne(orderId);
      return { order: response.data as Partial<Order> };
    } catch (error: any) {
      triggerAlert({
        type: "deleted",
        title: "Error",
        message: "Something went wrong please try again",
      });
      throw error;
    }
  },
);

// - The type of the Redux state ({ state: RootState }) indicating access to the entire Redux state tree
export const addOrder = createAsyncThunk<OrderDtoResponse, Order, { state: RootState }>(
  "orders/addOrder",
  async (newOrder) => {
    return new Promise<OrderDtoResponse>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      myClient.orders
        .ordersControllerCreate(newOrder as any)
        .then((response) => {
          resolve(response.data);
          return response.data;
        })
        .catch((error: any) => {
          triggerAlert({
            type: "deleted",
            title: "Error",
            message: error.error.message,
          });
          reject(error);
        })
        .finally(() => {
          ReduxStore.dispatch(setLoading(false));
        });
    });
  },
);

export const deleteOrder = createAsyncThunk<Order | any, string, { state: RootState }>(
  "orders/deleteOrder",
  async (orderId) => {
    const promise = new Promise<ResponseDto>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      myClient.orders
        .ordersControllerRemove(orderId)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
          triggerAlert({
            type: "deleted",
            title: "Error",
            message: error.error.message,
          });
        })
        .finally(() => {
          ReduxStore.dispatch(setLoading(false));
        });
    });
    return promise;
  },
);
export const togglePayment = createAsyncThunk(
  'orders/togglePayment',
  async ({ orderId, amount }: { orderId: string; amount: number }) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.patch(
      `http://localhost:6001/orders/${orderId}/payment`, 
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

export const markPaid = createAsyncThunk(
  'orders/markPaid',
  async (orderId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.patch(
      `http://localhost:6001/orders/${orderId}/paid`,
      {},  // ✅ Body vide
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);
export const updateOrderStatus = createAsyncThunk<
  OrderDtoResponse,
  { id: string; orderStatusId: number },
  { state: RootState }
>(
  "orders/updateOrderStatus",
  async ({ id, orderStatusId }) => {
    return new Promise<OrderDtoResponse>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);

      console.log("API UPDATE", id, orderStatusId);

      myClient.orders
        .ordersControllerUpdateStatus(id, { orderStatusId } as any)
        .then((res) => resolve(res.data))
        .catch((error: any) => {
          reject(error);
          triggerAlert({
            type: "deleted",
            title: "Error",
            message: error?.response?.data?.message,
          });
        })
        .finally(() => {
          ReduxStore.dispatch(setLoading(false));
        });
    });
  }
);





export const updateOrder = createAsyncThunk<any, any, { state: RootState }>(
  "order/updateOrder",
  async (updatedOrder) => {
    return new Promise<OrderDtoResponse>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      let { id, createdAt, updatedAt, deliveredByUserId, deletedAt, ...newOrder } = updatedOrder;
      myClient.orders
        .ordersControllerUpdate(updatedOrder.id, newOrder)

        .then((res) => {
          resolve(res.data);
        })
        .catch((error: any) => {
          reject(error);
          triggerAlert({
            type: "deleted",
            title: "Error",
            message: error.response.data.message,
          });
        })
        .finally(() => {
          ReduxStore.dispatch(setLoading(false));
        });
    });
  },
);
export const updateOrderDeliverPerson = createAsyncThunk<any, any, { state: RootState }>(
  "order/updateOrder",
  async (updatedOrder) => {
    return new Promise<OrderDtoResponse>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      let { id, createdAt, updatedAt, deletedAt, ...newOrder } = updatedOrder;
      myClient.orders
        .ordersControllerUpdateOrderTransporter(updatedOrder.id, newOrder)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error: any) => {
          reject(error);
          triggerAlert({
            type: "deleted",
            title: "Error",
            message: error.response.data.message,
          });
        })
        .finally(() => {
          ReduxStore.dispatch(setLoading(false));
        });
    });
  },
);
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      const totalPages = Math.ceil(state.count / state.limit);
      if (action.payload > totalPages || action.payload < 1) {
        return;
      }
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filtredUuid = action.payload;
    },
    setFiltredStatus(state, action: PayloadAction<string>) {
      state.filtredStatus = action.payload;
    },
    setFetchedOrderToNull(state) {
      state.fetchedOrder = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderStatuses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderStatuses.fulfilled, (state, action) => {
        state.status = "idle";
        state.orderStatus = action.payload;
      })
      .addCase(fetchOrdersByTransporter.pending, (state) => {
       state.status = "loading";
      })
      .addCase(fetchOrdersByTransporter.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders = action.payload.orders;
        state.count = action.payload.count;
      })
      .addCase(fetchOrdersByTransporter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(fetchOrderStatuses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders = action.payload.orders;
        state.count = action.payload.count;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })

      .addCase(getOrderById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.status = "idle";
        state.fetchedOrder = action.payload.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })

      .addCase(addOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.status = "idle";

        let orderExists = false;

        for (const order of state.orders) {
          if (order.id === action.payload.id) {
            orderExists = true;
            break;
          }
        }
        if (!orderExists) {
          state.orders.unshift(action.payload as Order);
          state.count++;
          triggerAlert({
            type: "created",
            title: "Order Created",
            message: `Order created successfully.`,
          });
        }
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong please try again";
        triggerAlert({
          type: "deleted",
          title: "Error",
          message: state.error,
        });
      })
      .addCase(deleteOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        // I want the backend to correct the return type to order not object
        state.status = "idle";
        let orderExists = false;

        for (const order of state.orders) {
          if (order.id === action.payload.id) {
            orderExists = true;
            break;
          }
        }
        const index = state.orders.findIndex((order) => order.id === action.payload);
        if (orderExists) {
          state.orders.splice(index, 1);
          state.count--;
          triggerAlert({
            type: "created",
            title: "Order Deleted",
            message: `Order deleted successfully.`,
          });
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(updateOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(togglePayment.fulfilled, (state, action) => {
       const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.status = 'idle';
      })
      .addCase(togglePayment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(markPaid.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.status = 'idle';
      })
      .addCase(markPaid.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          // check if the order is different from the one in the list
          if (JSON.stringify(state.orders[index]) !== JSON.stringify(action.payload)) {
            state.orders[index] = action.payload;
            triggerAlert({
              type: "saved",
              title: "Order Updated",
              message: `Order  updated successfully.`,
            });
          }
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
      
  },
});

export const setPage =
  (page: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(orderSlice.actions.setPage(page));
    dispatch(fetchOrders());
  };

export const setLimit =
  (limit: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(orderSlice.actions.setLimit(limit));
    dispatch(fetchOrders());
  };
export const setFilter =
  (filteredUuid: string): AppThunk =>
  (dispatch, _getState) => {
    dispatch(orderSlice.actions.setFilter(filteredUuid));
    dispatch(fetchOrders());
  };

export const setFiltredStatus =
  (filtredStatus: string): AppThunk =>
  (dispatch, _getState) => {
    dispatch(orderSlice.actions.setFiltredStatus(filtredStatus));
    dispatch(fetchOrders());
  };
export const selectOrders = (state: RootState) => state.orders.orders;

export const selectFetchedOrder = (state: RootState) => state.orders.fetchedOrder;

export const selectPage = (state: RootState) => state.orders.page;

export const selectLimit = (state: RootState) => state.orders.limit;

export const selectcount = (state: RootState) => state.orders.count;

export const selectStatus = (state: RootState) => state.orders.status;

export const selectOrderStatus = (state: RootState) => state.orders.orderStatus;

export const setFetchedOrderToNull = orderSlice.actions.setFetchedOrderToNull;

export default orderSlice.reducer;
