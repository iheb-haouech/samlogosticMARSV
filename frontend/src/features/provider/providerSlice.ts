import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiClientWithHeaders } from "../../api";
import { AppThunk, RootState } from "../../store/store";

type Filter = { verified: boolean; filtredEmail: string };
interface ProvidersState {
  status: "idle" | "loading" | "failed";
  providers: [];
  providersLoadMore: [];
  error: string | null;
  page: number;
  limit: number;
  loadMoreLimit: number;
  totalCount: number;
  filter: Filter;
}

const initialState: ProvidersState = {
  status: "idle",
  providers: [],
  providersLoadMore: [],
  error: null,
  page: 1,
  limit: 10,
  loadMoreLimit: 5,
  totalCount: 0,
  filter: { verified: false, filtredEmail: "" },
};

export const fetchProviders = createAsyncThunk<any, void, { state: RootState }>(
  "providers/fetchProviders",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token: any = localStorage.getItem("accessToken");
      const myClient = ApiClientWithHeaders(token);
      const response = await myClient.user.userControllerFindAllProviders({
        page: state.provider.page.toString(),
        limit: state.provider.limit.toString(),
        verified: state.provider.filter.verified.toString(),
        email: state.provider.filter.filtredEmail,
      } as any);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
);
export const fetchProvidersLoadMore = createAsyncThunk<any, void, { state: RootState }>(
  "providers/fetchProvidersLoadMore",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token: any = localStorage.getItem("accessToken");
      const myClient = ApiClientWithHeaders(token);
      const response = await myClient.user.userControllerFindAllProviders({
        page: "1",
        limit: state.provider.loadMoreLimit.toString(),
        verified: "true",
        email: state.provider.filter.filtredEmail,
      } as any);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
);
export const generateProviderInvoice = createAsyncThunk<
  any,
  { id: number; from: string; to: string },
  { state: RootState }
>("providers/generateProviderInvoice", async (data) => {
  try {
    const token: any = localStorage.getItem("accessToken");
    const myClient = ApiClientWithHeaders(token);
    const response = await myClient.user.userControllerGetProvidersInvoice(data);
    console.log("generateProviderInvoice", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
});
const providerSlice = createSlice({
  name: "provider",
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
    setLoadMoreProviders(state, action: PayloadAction<number>) {
      if (action.payload > state.totalCount || action.payload < 1) {
        state.loadMoreLimit = state.totalCount;
      } else {
        state.loadMoreLimit = action.payload;
      }
      state.page = 1;
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter.verified = action.payload.verified;
      state.filter.filtredEmail = action.payload.filtredEmail;
    },

    updateProviders: (state, action) => {
      state.providers = state.providers.filter((provider: any) => provider.id !== action.payload) as [];
      state.totalCount--;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.status = "idle";
        state.providers = action.payload.providers;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred in fetching providers data";
      })
      .addCase(fetchProvidersLoadMore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProvidersLoadMore.fulfilled, (state, action) => {
        state.status = "idle";
        state.providersLoadMore = action.payload.providers;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchProvidersLoadMore.rejected, (state) => {
        state.status = "failed";
        state.error = "An error occurred in fetching providers data";
      })
      .addCase(generateProviderInvoice.pending, (state) => {
        state.status = "loading";
      })
      .addCase(generateProviderInvoice.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(generateProviderInvoice.rejected, (state) => {
        state.status = "failed";
        state.error = "An error occurred in generateProviderInvoice   ";
      });
  },
});

export const setPage =
  (page: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(providerSlice.actions.setPage(page));
    dispatch(fetchProviders());
  };

export const setLimit =
  (limit: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(providerSlice.actions.setLimit(limit));
    dispatch(fetchProviders());
  };

export const setLoadMoreProviders =
  (loadMoreLimit: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(providerSlice.actions.setLoadMoreProviders(loadMoreLimit));
    dispatch(fetchProvidersLoadMore());
  };

export const setFilter =
  (filter: Filter): AppThunk =>
  (dispatch, _getState) => {
    dispatch(providerSlice.actions.setFilter(filter));
    dispatch(fetchProviders());
  };

export const selectStatus = (state: RootState) => state.provider.status;

export const selectProviders = (state: RootState) => state.provider.providers;
export const selectProvidersLoadMore = (state: RootState) => state.provider.providersLoadMore;

export const selectPage = (state: RootState) => state.provider.page;

export const selectLimit = (state: RootState) => state.provider.limit;
export const selectLoadMoreLimit = (state: RootState) => state.provider.loadMoreLimit;

export const selectTotalCount = (state: RootState) => state.provider.totalCount;

export const selectFilter = (state: RootState) => state.provider.filter;

export const { updateProviders } = providerSlice.actions;

export default providerSlice.reducer;
