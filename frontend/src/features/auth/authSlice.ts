import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState, store } from "../../store/store";
import { AuthResponseDto, LoginDto, ResetPasswordDto, ResetPasswordReqDto } from "../../api/myApi";
import { apiClient } from "../../api";
import { triggerAlert } from "../../Alert/alertModule";
import { setCurrentUser } from "../user/userSlice";
interface AuthState {
  status: "idle" | "loading" | "failed";
  accessToken: object;
  refreshToken: object;
  user: object;
  isRequestResetPsw: boolean;
  isResetPsw: boolean;
  error?: string;
}
const initialState: AuthState = {
  status: "idle",
  accessToken: {},
  refreshToken: {},
  user: {},
  error: "",
  isRequestResetPsw: false,
  isResetPsw: false,
};

export const signup = createAsyncThunk<
  any,  // ← any pour tester
  any,
  { state: RootState }
>(
  "auth/signup",
  async (newUser: any) => {
    const response = await apiClient.auth.authControllerRegister(newUser);
    return response.data;  // { email, message }
  }
);

export const login = createAsyncThunk<AuthResponseDto, LoginDto, { state: RootState }>(
  "auth/login",
  async (user: LoginDto) => {
    try {
     const response: any = await apiClient.auth.authControllerLogin(user);

      localStorage.setItem("accessToken", response.data.accessToken as any);
      localStorage.setItem("refreshToken", response.data.refreshToken as any);
      store.dispatch(setCurrentUser(response.data.user));

      return response.data;
    } catch (error: any) {
      triggerAlert({
        type: "deleted",
        title: "Error logging in",
        message: error.error.message,
      });
      throw error;
    } finally {
      // store.dispatch(setLoading(false));
    }
  },
);
export const resetPasswordReq = createAsyncThunk<boolean | any, ResetPasswordReqDto, { state: RootState }>(
  "auth/resetPasswordReq",
  async (resetPasswordReqDto: ResetPasswordReqDto) => {
    try {
      const response = await apiClient.auth.authControllerRequestPasswordReset(resetPasswordReqDto);
      return response.data;
    } catch (error: any) {
      triggerAlert({
        type: "deleted",
        title: "Error in requesting reset password",
        message: error.error.message,
      });
      throw error;
    } finally {
      // store.dispatch(setLoading(false));
    }
  },
);
export const resetPassword = createAsyncThunk<boolean | any, ResetPasswordDto, { state: RootState }>(
  "auth/resetPassword",
  async (resetPasswordDto: ResetPasswordDto) => {
    try {
      const response = await apiClient.auth.authControllerResetPassword(resetPasswordDto);

      return response.data;
    } catch (error: any) {
      triggerAlert({
        type: "deleted",
        title: "Error in reseting password",
        message: error.error.message,
      });
      throw error;
    } finally {
      // store.dispatch(setLoading(false));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      //Signup
      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponseDto>) => {
        state.status = "idle";
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })

      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Somethin went wrong";
      })

      //Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponseDto>) => {
        state.status = "idle";
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })

      //Request reset Password
      .addCase(resetPasswordReq.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordReq.fulfilled, (state, action: PayloadAction<boolean | any>) => {
        state.status = "idle";
        state.isRequestResetPsw = action.payload;
        if (state.isResetPsw == true) {
          triggerAlert({
            type: "created",
            title: "Success",
            message:
              "A password reset link has been sent to your email. Please follow the instructions in the email to reset your password.",
          });
        } else {
          triggerAlert({
            type: "deleted",
            title: "Password Reset Request Error",
            message: "Unable to process your password reset request. Please check your email and try again later.",
          });
        }
      })
      .addCase(resetPasswordReq.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })
      //resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<boolean | any>) => {
        state.status = "idle";
        state.isResetPsw = action.payload;
        if (state.isResetPsw == true) {
          triggerAlert({
            type: "created",
            title: "Password Reset Successful",
            message: "Your password has been reset successfully!",
          });
        } else {
          triggerAlert({
            type: "deleted",
            title: "Password Reset Error",
            message: "Invalid or expired token. Please try again or request a new password reset link!",
          });
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const selectUser = (state: RootState) => state.auth.user;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export const selectStatus = (state: RootState) => state.auth.status;

export const selectIsResetPsw = (state: RootState) => state.auth.isResetPsw;

export const selectIsRequestResetPsw = (state: RootState) => state.auth.isRequestResetPsw;

export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

