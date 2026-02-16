import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentData: null,
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {
    paymentPending: (state) => {
      state.loading = true;
    },
    paymentSuccess: (state, action) => {
      state.paymentData = action.payload;
      state.loading = false;
    },
    paymentFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    getPaymentsPending: (state) => {
      state.loading = true;
    },
    getPaymentsSuccess: (state, action) => {
      state.payments = action.payload;
      state.loading = false;
    },
    getPaymentsFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  
    approveOrRejectPending: (state) => {
      state.loading = true;
    },
    approveOrRejectSuccess: (state, action) => {
      state.paymentData = action.payload;
      state.loading = false;
    },
    approveOrRejectFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  paymentFailed,
  paymentPending,
  paymentSuccess,
  getPaymentsFailed,
  getPaymentsPending,
  getPaymentsSuccess,
  approveOrRejectFailed,
  approveOrRejectPending,
  approveOrRejectSuccess,
} = paymentSlice.actions;

export default paymentSlice.reducer;
