import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api";
import { RootState } from "../../store/store";

interface AuthState {
  status: "idle" | "loading" | "failed";
  error: string | null;
  companyTypes: any[];
}

const initialState: AuthState = {
  status: "idle",
  error: null,
  companyTypes: [],
};
export const fetchCompanyTypes = createAsyncThunk<any, void, { state: RootState }>(
  "companyType/fetchCompanyTypes",
  async () => {
    try {
      const response = await apiClient.companyTypes.appControllerGetAllCompanyTypes();
      const responseData: any = response.data;
      return responseData.company_types;
    } catch (error: any) {
      throw error;
    }
  },
);

const companyTypeSlice = createSlice({
  name: "companyType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanyTypes.fulfilled, (state, action) => {
        state.status = "idle";
        state.companyTypes = action.payload;
      })
      .addCase(fetchCompanyTypes.rejected, (state) => {
        state.status = "failed";
        state.error = "Something went wrong";
      });
  },
});

export const selectCompanyTypes = (state: RootState) => state.companyType.companyTypes;

export const selectCompanyTypesStatus = (state: RootState) => state.companyType.status;

export default companyTypeSlice.reducer;
