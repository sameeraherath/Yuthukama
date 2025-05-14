import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;

export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (formData, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/api/users/profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile picture"
      );
    }
  }
);

export const updateUsername = createAsyncThunk(
  "user/updateUsername",
  async (username, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/api/users/username`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update username"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    message: "",
  },
  reducers: {
    clearMessage: (state) => {
      state.message = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state) => {
        state.loading = false;
        state.message = "Profile picture updated successfully";
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsername.fulfilled, (state) => {
        state.loading = false;
        state.message = "Username updated successfully";
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;
