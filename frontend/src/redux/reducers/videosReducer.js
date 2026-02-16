import { createSlice } from "@reduxjs/toolkit";

const videosSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    error: null,
    loading: false,
    loadingCreate: false,
    createdVideo: null,
  },
  reducers: {
    getVideosPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    getVideosSuccess: (state, action) => {
      state.loading = false;
      state.videos = action.payload;
      state.error = null;
    },
    getVideosFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createVideoPending: (state) => {
      state.loadingCreate = true;
      state.error = null;
    },
    createVideoSuccess: (state, action) => {
      state.loadingCreate = false;
      state.createdVideo = action.payload;
      state.error = null;
    },
    createVideoFail: (state, action) => {
      state.loadingCreate = false;
      state.error = action.payload;
    },
  },
});

export const {
  getVideosPending,
  getVideosSuccess,
  getVideosFail,
  createVideoFail,
  createVideoPending,
  createVideoSuccess,
} = videosSlice.actions;

export default videosSlice.reducer;
