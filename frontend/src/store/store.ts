import { Action, ThunkAction, configureStore  } from "@reduxjs/toolkit";
import loadingSlice from "../features/loading/loadingSlice";
import authSlice from "../features/auth/authSlice";
import userSlice from "../features/user/userSlice";
import orderSlice from "../features/order/orderSlice";
import transporterSlice from "../features/transporter/transporterSlice";
import providerSlice from "../features/provider/providerSlice";
import complaintSlice from "../features/complaint/complaintSlice";
import companyTypeSlice from "../features/companyType/companyTypeSlice";
import statisticsSlice from "../features/statistics/statisticsSlice";
import companyActivitySlice from "../features/companyActivity/companyActivitySlice";
import { transportersApi } from '../features/transporter/transportersApi';
export const store = configureStore({
  reducer: {
    loading: loadingSlice,
    auth: authSlice,
    user: userSlice,
    orders: orderSlice,
    transporter: transporterSlice,
    provider: providerSlice,
    complaint: complaintSlice,
    companyType: companyTypeSlice,
    companyActivity: companyActivitySlice,
    statistics: statisticsSlice,
    [transportersApi.reducerPath]: transportersApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(transportersApi.middleware),
    });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
