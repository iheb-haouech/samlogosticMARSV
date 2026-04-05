import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiClientWithHeaders } from "../../api";
import { AppThunk, RootState, store } from "../../store/store";
import { AddClaimMsgDto, CreateClaimDto, CreateRespDTO, ResponseDto, UpdateRespDTO } from "../../api/myApi";
import { triggerAlert } from "../../Alert/alertModule";
import { setLoading } from "../loading/loadingSlice";
import { Complaint, message } from "../../types/Complaint";

interface ComplaintState {
  complaints: Complaint[];
  opnedComplaint: Complaint;
  totalCount: number;
  status: "idle" | "loading" | "failed";
  getComplaintStatus: "idle" | "loading" | "failed";
  error?: string;
  complaintStatus: "1" | "2";
  page: number;
  limit: number;
  filtredTrakingNumber: string;
}
const initialState: ComplaintState = {
  status: "idle",
  getComplaintStatus: "idle",
  complaints: [],
  totalCount: 0,
  opnedComplaint: {
    subject: "",
    orderId: "",
    messages: [],
    order: {
      id: "",
      trackingId: "",
    },
    creator: {
      id: 5,
      companyName: "",
      email: "",
    },
  },
  complaintStatus: "1",
  page: 1,
  limit: 5,
  filtredTrakingNumber: "null",
};

// - The type of the Redux state ({ state: RootState }) indicating access to the entire Redux state tree
export const addComplaint = createAsyncThunk<CreateRespDTO, CreateClaimDto, { state: RootState }>(
  "complaint/addComplaint",
  async (newComplaint) => {
    return new Promise<CreateRespDTO>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      console.log("NEW COMPLAINT SENT:", newComplaint);
      myClient.claims
        .claimsControllerCreate(newComplaint)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error);
          triggerAlert({
            type: "deleted",
            title: "Error",
            message: error ?? "Something went wrong",
          });
        })
        .finally(() => store.dispatch(setLoading(false)));
    });
  },
);

export const fetchAllComplaints = createAsyncThunk<
  { complaints: Complaint[] | any; totalCount: number },
  void,
  { state: RootState }
>("complaint/fetchComplaints", async (_, thunkAPI) => {
  return new Promise<{ complaints: Complaint[] | any; totalCount: number }>((resolve, reject) => {
    const state = thunkAPI.getState() as RootState;
    const token = localStorage.getItem("accessToken")!;
    const myClient = ApiClientWithHeaders(token);
    const params: any = {
      page: "1",
      limit: state.complaint.limit.toString(),
      status: state.complaint.complaintStatus,
    };

    // only add id if needed
    if (state.complaint.filtredTrakingNumber !== "null") {
      params.id = state.complaint.filtredTrakingNumber;
    }

    // ⚠️ TEMP: remove status filter completely for test
    // params.status = Number(state.complaint.complaintStatus);

    console.log("PARAMS:", params);

    myClient.claims.claimsControllerFindAll(params)
      .then((response) => {
    console.log("API RESPONSE:", response.data);     
    resolve({ complaints: response.data.claims, totalCount: response.data.totalCount });
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

export const getComplaintById = createAsyncThunk<any, string, { state: RootState }>(
  "complaint/getComplaintById",
  async (id) => {
    return new Promise<any>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      myClient.claims
        .claimsControllerFindOne(id)
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
  },
);
export const deleteComplaint = createAsyncThunk<ResponseDto | any, string, { state: RootState }>(
  "complaints/deleteComplaint",
  async (complaintId) => {
    const promise = new Promise<any>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      myClient.claims
        .claimsControllerRemove(complaintId)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
          triggerAlert({
            type: "deleted",
            title: "Error",
            message: error.error.message ?? "Something went wrong",
          });
        })
        .finally(() => store.dispatch(setLoading(false)));
    });
    return promise;
  },
);

export const addMessage = createAsyncThunk<ResponseDto, AddClaimMsgDto, { state: RootState }>(
  "complaint/addMessage",
  async (newMessage) => {
    return new Promise<ResponseDto>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      myClient.claims
        .claimsControllerAddMessage(newMessage)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error);
          triggerAlert({
            type: "deleted",
            title: "Error",
            message: error.error ?? "Something went wrong",
          });
        });
    });
  },
);
export const updateComplaint = createAsyncThunk<any, any, { state: RootState }>(
  "complaint/updateComplaint",
  async (updatedCompailnt) => {
    return new Promise<UpdateRespDTO>((resolve, reject) => {
      const token = localStorage.getItem("accessToken")!;
      const myClient = ApiClientWithHeaders(token);
      let { id, ...newComplaint } = updatedCompailnt;
      myClient.claims
        .claimsControllerUpdate(updatedCompailnt.id, newComplaint)

        .then((res) => {
          resolve(res.data);
        })
        .catch((error: any) => {
          reject(error);
          triggerAlert({
            type: "deleted",
            title: "Error",
            message: error.response.data ?? "Something went wrong",
          });
        })
        .finally(() => {
          store.dispatch(setLoading(false));
        });
    });
  },
);
const complaintSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    setComplaintStatus(state, action) {
      state.complaintStatus = action.payload;
    },
    setComplaintsLimit(state, action: PayloadAction<number>) {
      if (action.payload > state.totalCount || action.payload < 1) {
        state.limit = state.totalCount;
      } else {
        state.limit = action.payload;
      }
      state.page = 1;
    },
    setComplaintSearch(state, action: PayloadAction<string>) {
      state.filtredTrakingNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateComplaint.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.status = "idle";
        let complaintExists = false;

        for (const complaint of state.complaints) {
          if (complaint.id === action.payload.id) {
            complaintExists = true;
            break;
          }
        }
        const index = state.complaints.findIndex((complaint) => complaint.id === action.payload.id);
        if (complaintExists) {
          state.totalCount--;

          state.complaints.splice(index, 1);
          triggerAlert({
            type: "saved",
            title: "Complaint Marked resolved",
            message: `Complaint  updated successfully.`,
          });
        }
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(addComplaint.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addComplaint.fulfilled, (state, action: any) => {
        state.status = "idle";
        let complaintExists = false;

        for (const complaint of state.complaints) {
          if (complaint.id === action.payload.id) {
            complaintExists = true;
            break;
          }
        }
        if (!complaintExists) {
          state.complaints.unshift(action.payload);
          triggerAlert({
            type: "created",
            title: "Complaint Created",
            message: `Complaint created successfully.`,
          });
        }
      })
      .addCase(addComplaint.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(fetchAllComplaints.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllComplaints.fulfilled, (state, action) => {
        state.status = "idle";
        state.complaints = action.payload.complaints;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchAllComplaints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })

      .addCase(getComplaintById.pending, (state) => {
        state.getComplaintStatus = "loading";
      })
      .addCase(getComplaintById.fulfilled, (state, action) => {
        state.getComplaintStatus = "idle";
        state.opnedComplaint = action.payload;
      })
      .addCase(getComplaintById.rejected, (state, action) => {
        state.getComplaintStatus = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(deleteComplaint.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        // I want the backend to correct the return type to Complaint not object
        state.status = "idle";

        let complaintExists = false;

        for (const complaint of state.complaints) {
          if (complaint.id === action.payload.id) {
            complaintExists = true;
            break;
          }
        }
        const index = state.complaints.findIndex((complaint) => complaint.id === action.payload.id);
        if (complaintExists) {
          state.totalCount--;
          state.complaints.splice(index, 1);
          triggerAlert({
            type: "created",
            title: "Complaint Deleted",
            message: `Complaint deleted successfully.`,
          });
        }
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(addMessage.pending, (state) => {
        state.status = "loading";
      })

      .addCase(addMessage.fulfilled, (state, action: any) => {
        state.status = "idle";

        const messageId = action.payload.id;
        const complaintId = action.payload.claimId;
        const complaintToUpdate = state.complaints.find((complaint) => complaint.id === complaintId);

        if (complaintToUpdate) {
          const messageExists = complaintToUpdate.messages.some((message) => message.id === messageId);

          if (!messageExists) {
            complaintToUpdate.messages.push(action.payload as message);
          }
        }
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});
export const setComplaintStatus =
  (status: "1" | "3"): AppThunk =>
  (dispatch, _getState) => {
    dispatch(complaintSlice.actions.setComplaintStatus(status));
    store.dispatch(setLoading(true));
    dispatch(fetchAllComplaints());
  };
export const setComplaintsLimit =
  (limit: number): AppThunk =>
  (dispatch, _getState) => {
    dispatch(complaintSlice.actions.setComplaintsLimit(limit));
    dispatch(fetchAllComplaints());
  };
export const setComplaintSearch =
  (trakingNumber: string): AppThunk =>
  (dispatch, _getState) => {
    dispatch(complaintSlice.actions.setComplaintSearch(trakingNumber));
    dispatch(fetchAllComplaints());
  };
export const selectedComplaints = (state: RootState) => state.complaint.complaints;
export const selectedStatus = (state: RootState) => state.complaint.status;
export const selectedGetComplaintStatus = (state: RootState) => state.complaint.getComplaintStatus;
export const selectedTotalCountComplaints = (state: RootState) => state.complaint.totalCount;
export const selectedLimit = (state: RootState) => state.complaint.limit;

export const selectedOpnedComplaint = (state: RootState) => state.complaint.opnedComplaint;
export default complaintSlice.reducer;
