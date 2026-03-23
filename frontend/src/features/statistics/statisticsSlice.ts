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
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.status = "idle";
        state.statistics = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state) => {
        state.status = "failed";
        state.error = "Something went wrong";
      });
  },
});
export const selectedStatistic = (state: RootState) => state.statistics.statistics;
export const selectedStatus = (state: RootState) => state.statistics.status;

export default statisticsSlice.reducer;
