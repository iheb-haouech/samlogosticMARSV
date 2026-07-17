import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Statistic } from "../../types/Statistics";
import { ApiClientWithHeaders, API_BASE_URL } from "../../api";
import { RootState, store } from "../../store/store";
import { setLoading } from "../loading/loadingSlice";
import { triggerAlert } from "../../Alert/alertModule";
import { refreshAccessToken } from "../auth/authSlice";

export interface ClientKpis {
  summary: {
    totalOrders: number;
    delivered: number;
    inTransit: number;
    waiting: number;
    returned: number;
    canceled: number;
  };
  kpis: {
    onTimeRate: number;
    damageRate: number;
    avgResolutionDays: number;
    costPerParcel: number;
    returnRate: number;
    totalClaims: number;
    openClaims: number;
  };
  monthlyVolume: { month: string; volume: number }[];
}

interface StatisticsState {
  statistics: Statistic;
  clientKpis: ClientKpis | null;
  kpisStatus: "idle" | "loading" | "failed";
  kpisError?: string;
  status: "idle" | "loading" | "failed";
  error?: string;
}
const initialState: StatisticsState = {
  statistics: {},
  clientKpis: null,
  kpisStatus: "idle",
  kpisError: undefined,
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

// B2B client logistics KPIs (dashboard), scoped to the authenticated client.
// Automatically refreshes the access token once on 401 before giving up.
export const fetchClientKpis = createAsyncThunk<ClientKpis>(
  "statistics/fetchClientKpis",
  async (_, { rejectWithValue }) => {
    const call = async (token: string): Promise<ClientKpis> => {
      const res = await fetch(`${API_BASE_URL}/client-kpis`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err: any = new Error("Failed to load KPIs");
        err.status = res.status;
        throw err;
      }
      return (await res.json()) as ClientKpis;
    };

    try {
      const token = localStorage.getItem("accessToken")!;
      try {
        return await call(token);
      } catch (error: any) {
        if (error?.status === 401) {
          const newToken = await store.dispatch(refreshAccessToken()).unwrap();
          return await call(newToken);
        }
        throw error;
      }
    } catch (error: any) {
      triggerAlert({
        type: "deleted",
        title: "Error",
        message:
          error?.status === 401
            ? "Your session has expired. Please log in again."
            : "Unable to load your logistics KPIs.",
      });
      return rejectWithValue(error?.message || "Failed to load KPIs");
    }
  },
);

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
    })
    .addCase(fetchClientKpis.pending, (state) => {
      state.kpisStatus = "loading";
      state.kpisError = undefined;
    })
    .addCase(fetchClientKpis.fulfilled, (state, action) => {
      state.kpisStatus = "idle";
      state.kpisError = undefined;
      state.clientKpis = action.payload;
    })
    .addCase(fetchClientKpis.rejected, (state, action) => {
      state.kpisStatus = "failed";
      state.kpisError = action.error.message || "Failed to load KPIs";
    });
}
});
export const selectedStatistic = (state: RootState) => state.statistics.statistics;
export const selectedStatus = (state: RootState) => state.statistics.status;
export const selectedClientKpis = (state: RootState) => state.statistics.clientKpis;
export const selectedKpisStatus = (state: RootState) => state.statistics.kpisStatus;

export default statisticsSlice.reducer;
