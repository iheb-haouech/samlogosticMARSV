import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiClientWithHeaders } from "../../api";
import { AppThunk, RootState } from "../../store/store";

type Filter = { verified: boolean; filtredFirstName: string };
interface TransporterState {
  status: "idle" | "loading" | "failed";
  transporters: [];
  AllTransportersNoPagination: [];
  transportersLoadMore: [];
  error: string | null;
  page: number;
  limit: number;
  loadMoreLimit: number;
  totalCount: number;
  filter: Filter;
}

const initialState: TransporterState = {
  status: "idle",
  transporters: [],
  AllTransportersNoPagination: [],
  transportersLoadMore: [],
  error: null,
  page: 1,
  limit: 10,
  loadMoreLimit: 5,
  totalCount: 0,
  filter: { verified: true, filtredFirstName: "" },
};

//With pagination
export const fetchTransporters = createAsyncThunk<any, void, { state: RootState }>(
  "transporter/fetchTransporters",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token: any = localStorage.getItem("accessToken");
      const myClient = ApiClientWithHeaders(token);
      const response = await myClient.transporters.transportersControllerFindAll({
        page: state.transporter.page.toString(),
        limit: state.transporter.limit.toString(),
        verified: state.transporter.filter.verified.toString(),
        firstName: state.transporter.filter.filtredFirstName,
      } as any);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
);
//Without pagination : TO DELETE
export const fetchAllTransportersNoPagination = createAsyncThunk<any, void, { state: RootState }>(
  "modalTransporter/fetchAllTransportersNoPagination",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token: any = localStorage.getItem("accessToken");
      const myClient = ApiClientWithHeaders(token);
      const response = await myClient.transporters.transportersControllerFindAll({
        page: "1",
        limit: "1000",
        verified: "true",
        firstName: state.transporter.filter.filtredFirstName,
      } as any);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
);
//With load more
export const fetchTransportersLoadMore = createAsyncThunk<any, void, { state: RootState }>(
  "modalTransporter/fetchTransportersLoadMore",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token: any = localStorage.getItem("accessToken");
      const myClient = ApiClientWithHeaders(token);
      const response = await myClient.transporters.transportersControllerFindAll({
        page: "1",
        limit: state.transporter.loadMoreLimit.toString(),
        verified: "true",
        firstName: state.transporter.filter.filtredFirstName,
      } as any);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
);
const transporterSlice = createSlice({
  name: "transporter",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      const totalPages = Math.ceil(state.totalCount / state.limit);
      if (action.payload > totalPages || action.payload < 1) {
        return;
      }
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },
    setLoadMoreTransporter(state, action: PayloadAction<number>) {
      if (action.payload > state.totalCount || action.payload < 1) {
        state.loadMoreLimit = state.totalCount;
      } else {
        state.loadMoreLimit = action.payload;
      }
      state.page = 1;
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter.verified = action.payload.verified;
      state.filter.filtredFirstName = action.payload.filtredFirstName;
    },

    updateTransporters: (state, action) => {
      state.transporters = state.transporters.filter((transporter: any) => transporter.id !== action.payload) as [];
      state.totalCount--;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransporters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransporters.fulfilled, (state, action) => {
        state.status = "idle";
        state.transporters = action.payload.transporters;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchTransporters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred in fetching transporters data";
      })
      .addCase(fetchAllTransportersNoPagination.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllTransportersNoPagination.fulfilled, (state, action) => {
        state.status = "idle";
        state.AllTransportersNoPagination = action.payload.transporters;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchAllTransportersNoPagination.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred in fetching transporters data";
      })
      .addCase(fetchTransportersLoadMore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransportersLoadMore.fulfilled, (state, action) => {
        state.status = "idle";
        state.transportersLoadMore = action.payload.transporters;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchTransportersLoadMore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred in fetching transporters data";
      });
  },
});

export const setPage =
  (page: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(transporterSlice.actions.setPage(page));
    dispatch(fetchTransporters());
  };

export const setLimit =
  (limit: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(transporterSlice.actions.setLimit(limit));
    dispatch(fetchTransporters());
  };
//For load more transporters
export const setLoadMoreTransporter =
  (limit: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(transporterSlice.actions.setLoadMoreTransporter(limit));
    dispatch(fetchTransportersLoadMore());
  };
export const setFilter =
  (filter: Filter): AppThunk =>
  (dispatch, _getState) => {
    dispatch(transporterSlice.actions.setFilter(filter));
    dispatch(fetchTransporters());
  };

export const selectStatus = (state: RootState) => state.transporter.status;

export const selectTransporters = (state: RootState) => state.transporter.transporters;
export const selectAllTransportersNoPagination = (state: RootState) => state.transporter.AllTransportersNoPagination;
export const selectTransportersLoadMore = (state: RootState) => state.transporter.transportersLoadMore;

export const selectPage = (state: RootState) => state.transporter.page;

export const selectLimit = (state: RootState) => state.transporter.limit;
export const selectLoadMoreLimit = (state: RootState) => state.transporter.loadMoreLimit;

export const selectTotalCount = (state: RootState) => state.transporter.totalCount;

export const selectFilter = (state: RootState) => state.transporter.filter;

export const { updateTransporters } = transporterSlice.actions;

export default transporterSlice.reducer;
