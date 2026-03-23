import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;

export const selectLoadingState = (state: RootState) => state.loading.loading;
