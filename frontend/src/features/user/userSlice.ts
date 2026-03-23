import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiClientWithHeaders } from "../../api";
import { AuthResponseDto, ResponseDto } from "../../api/myApi";
import { RootState } from "../../store/store";
import { triggerAlert } from "../../Alert/alertModule";

interface AuthState {
  status: "idle" | "loading" | "failed";
  error: string | null;
  currentUser: object | null;
  // accessToken: object | null; //TODO Add them if needed or remove them
  // refreshToken: object | null;
}

const initialState: AuthState = {
  status: "idle",
  error: null,
  currentUser: null,
  // accessToken: null,
  // refreshToken: null,
};
export const fetchCurrentUser = createAsyncThunk<AuthResponseDto, string, { state: RootState }>(
  "user/fetchCurrentUser",
  async (token: string) => {
    try {
      const myClient = ApiClientWithHeaders(token);
      const response = await myClient.auth.authControllerGetAuthenticatedUser();
      return response.data;
    } catch (error: any) {
      console.error("An error occurred in fetching current user data:", error.error.message); //TODO
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      throw error;
    }
  },
);
export const deleteUser = createAsyncThunk<any, string, { state: RootState }>("user/deleteUser", async (userId) => {
  const promise = new Promise<ResponseDto>((resolve, reject) => {
    const token = localStorage.getItem("accessToken")!;
    const myClient = ApiClientWithHeaders(token);
    myClient.user
      .userControllerRemove(userId)
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
      });
  });
  return promise;
});
export const updateUser = createAsyncThunk<any, any, { state: RootState }>("user/updateUser", async (updatedUser) => {
  return new Promise<any>((resolve, reject) => {
    const token = localStorage.getItem("accessToken")!;
    const myClient = ApiClientWithHeaders(token);
    let { id, verified, createdAt, updatedAt, disponibility, roleId, deletedAt, userPackId, ...newUser } = updatedUser;
    myClient.user
      .userControllerUpdate(updatedUser?.id, newUser)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error: any) => {
        reject(error);
        triggerAlert({
          type: "deleted",
          title: "Error",
          message: "Something went wrong please try again",
        });
      });
  });
});
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentUser = action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.currentUser = null;
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = "idle";
        state.currentUser = null;
        triggerAlert({
          type: "created",
          title: "User Deleted",
          message: `User deleted successfully.`,
        });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "login";
        window.location.reload();
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentUser = action.payload;
        triggerAlert({
          type: "created",
          title: "User Updated",
          message: `User updated successfully.`,
        });
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const selectCurrentUser = (state: RootState) => state.user.currentUser;

export const { setCurrentUser } = userSlice.actions;

export const selectStatus = (state: RootState) => state.user.status;

export default userSlice.reducer;
