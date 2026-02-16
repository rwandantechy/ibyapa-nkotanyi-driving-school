import { createSlice } from "@reduxjs/toolkit";

const performanceSlice = createSlice({
  name: "performance",
  initialState: {
    performances: [],       
    error: null,             
    loading: false,         
  },
  reducers: {
    getPerformancePending: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPerformanceSuccess: (state, action) => {
      state.loading = false;
      state.performances = action.payload;
      state.error = null;
    },
    getPerformanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPerformancePending: (state) => {
      state.loadingCreate = true;
      state.error = null;
    },
    createPerformanceSuccess: (state, action) => {
      state.loadingCreate = false;
      state.performances = [...state.performances, action.payload]; 
      state.error = null;
    },
    createPerformanceFailure: (state, action) => {
      state.loadingCreate = false;
      state.error = action.payload;
    },
  },
});

export const {
  getPerformancePending,
  getPerformanceSuccess,
  getPerformanceFailure,
  createPerformancePending,
  createPerformanceSuccess,
  createPerformanceFailure,
} = performanceSlice.actions;

export default performanceSlice.reducer;
