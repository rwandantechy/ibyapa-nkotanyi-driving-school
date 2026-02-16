import { createSlice } from "@reduxjs/toolkit";

const pdfSlice = createSlice({
  name: "pdfs",
  initialState: {
    pdfs: [],
    pdf: null,
    createdPdf: null,
    error: null,
    editPdfError: null,
    loading: false,
    loadingCreate: false,
    loadingEdit: false,
  },
  reducers: {
    getPdfsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPdfsSuccess: (state, action) => {
      state.loading = false;
      state.pdfs = action.payload;
      state.error = null;
    },
    getPdfsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPdfPending: (state) => {
      state.loadingCreate = true;
      state.error = null;
    },
    createPdfSuccess: (state, action) => {
      state.loadingCreate = false;
      state.createdPdf = action.payload;
      state.error = null;
    },
    createPdfFailure: (state, action) => {
      state.loadingCreate = false;
      state.error = action.payload;
    },
    editPdfPending: (state) => {
      state.loadingEdit = true;
      state.editPdfError = null;
    },
    editPdfSuccess: (state, action) => {
      state.loadingEdit = false;
      state.pdf = action.payload;
      state.editPdfError = null;
    },
    editPdfFailure: (state, action) => {
      state.loadingEdit = false;
      state.editPdfError = action.payload;
    },
  },
});

export const {
  getPdfsPending,
  getPdfsSuccess,
  getPdfsFailure,
  createPdfPending,
  createPdfFailure,
  createPdfSuccess,
  editPdfFailure,
  editPdfPending,
  editPdfSuccess,
} = pdfSlice.actions;
export default pdfSlice.reducer;
