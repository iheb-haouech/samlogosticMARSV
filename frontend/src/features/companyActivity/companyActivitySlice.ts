import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api";
import { RootState } from "../../store/store";

interface CompanyActivityState {
  status: "idle" | "loading" | "failed";
  error: string | null;
  companyActivities: any[];
}

const initialState: CompanyActivityState = {
  status: "idle",
  error: null,
  companyActivities: [],
};

export const fetchCompanyActivities = createAsyncThunk<any, void, { state: RootState }>(
  "companyActivity/fetchCompanyActivities",
  async () => {
    try {
      const response = await apiClient.companyActivities.appControllerGetAllCompanyActivities();
      const responseData: any = response.data;
      return responseData.company_activities;
    } catch (error: any) {
      throw error;
    }
  },
);

const companyActivitySlice = createSlice({
  name: "companyActivity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyActivities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanyActivities.fulfilled, (state, action) => {
        state.status = "idle";
        state.companyActivities = action.payload;
      })
      .addCase(fetchCompanyActivities.rejected, (state) => {
        state.status = "failed";
        state.error = "Something went wrong";
      });
  },
});

// Selectors
export const selectCompanyActivities = (state: RootState) => state.companyActivity.companyActivities;
export const selectCompanyActivitiesStatus = (state: RootState) => state.companyActivity.status;

// Export reducer
export default companyActivitySlice.reducer;
