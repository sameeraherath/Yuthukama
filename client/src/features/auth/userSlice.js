import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;

export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (formData, thunkAPI) => {
    try {
      console.log("Sending profile picture update request...");
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
      console.log("Server response for profile picture update:", data);
      return data;
    } catch (error) {
      console.error(
        "Profile picture update error:",
        error.response?.data || error
      );
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
        console.log("Profile picture update pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        console.log("Profile picture update fulfilled:", action.payload);
        state.loading = false;
        state.message = "Profile picture updated successfully";
        // Update the user in localStorage with the new profile picture
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
          console.log(
            "Updating localStorage user with new profile picture:",
            action.payload.profilePicture
          );
          currentUser.profilePicture = action.payload.profilePicture;
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        console.error("Profile picture update rejected:", action.payload);
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
