import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Statistic } from "../../types/Statistics";
import { ApiClientWithHeaders } from "../../api";
import { RootState, store } from "../../store/store";
import { setLoading } from "../loading/loadingSlice";
import { triggerAlert } from "../../Alert/alertModule";

interface StatisticsState {
  statistics: Statistic;
  status: "idle" | "loading" | "failed";
  error?: string;
}
const initialState: StatisticsState = {
  statistics: {},
  status: "idle",
  error: "",
};
export const fetchStatistics = createAsyncThunk<Statistic>("statistics/fetchAdminStatistics", async () => {
  return new Promise<Statistic>((resolve, reject) => {
    const token = localStorage.getItem("accessToken")!;
    const myClient = ApiClientWithHeaders(token);
    myClient.statistics
      .appControllerGetStatistics()
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: any) => {
        reject(error);
        triggerAlert({
          type: "deleted",
          title: "Error",
          message: error.response.data ?? "Something went wrong",
        });
      })
      .finally(() => store.dispatch(setLoading(false)));
  });
});

const statisticsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  builder
    .addCase(fetchStatistics.pending, (state) => {
      state.status = "loading";
      state.error = undefined;
    })
    .addCase(fetchStatistics.fulfilled, (state, action) => {
      state.status = "idle";
      state.error = undefined;

      // on copie tout ce que renvoie le backend
      state.statistics.totalWaitingOrders = action.payload.totalWaitingOrders;
      state.statistics.totalTransitOrders = action.payload.totalTransitOrders;
      state.statistics.totalLivredOrders = action.payload.totalLivredOrders;
      state.statistics.totalCanceledOrders = action.payload.totalCanceledOrders;
      state.statistics.totalAcceptedProviders = action.payload.totalAcceptedProviders;
      state.statistics.totalWaitingProviders = action.payload.totalWaitingProviders;
      state.statistics.totalAcceptedTransporters = action.payload.totalAcceptedTransporters;
      state.statistics.totalWaitingTransporters = action.payload.totalWaitingTransporters;
      state.statistics.totalComplaints = action.payload.totalComplaints;
      state.statistics.totalClosedComplaints = action.payload.totalClosedComplaints;

      // 👇 nouveaux blocs B2B/B2C (si présents)
      state.statistics.b2b = action.payload.b2b;
      state.statistics.b2c = action.payload.b2c;
    })
    .addCase(fetchStatistics.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to load statistics";
    });
}
});
export const selectedStatistic = (state: RootState) => state.statistics.statistics;
export const selectedStatus = (state: RootState) => state.statistics.status;

export default statisticsSlice.reducer;
