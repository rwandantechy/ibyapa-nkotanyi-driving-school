import { createSlice } from "@reduxjs/toolkit";

const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    questions: [],
    allQuestions: [],
    createdQuestion: null,
    editedQuestion: null,
    error: null,
    loading: false,
    loadingCreate: false,
    loadingEdit: false,
    errorEditing: null,
  },
  reducers: {
    getUserQuestionsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserQuestionsSuccess: (state, action) => {
      state.loading = false;
      state.questions = action.payload;
      state.error = null;
    },
    getUserQuestionsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getQuestionsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    getQuestionsSuccess: (state, action) => {
      state.loading = false;
      state.allQuestions = action.payload;
      state.error = null;
    },
    getQuestionsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createQuestionPending: (state) => {
      state.loadingCreate = true;
      state.error = null;
    },
    createQuestionSuccess: (state, action) => {
      state.loadingCreate = false;
      state.createdQuestion = action.payload;
      state.error = null;
    },
    createQuestionFail: (state, action) => {
      state.loadingCreate = false;
      state.error = action.payload;
    },

    editQuestionPending: (state) => {
      state.loadingEdit = true;
      state.errorEditing = null;
    },
    editQuestionSuccess: (state, action) => {
      state.loadingEdit = false;
      state.editedQuestion = action.payload;
      state.errorEditing = null;
    },
    editQuestionFail: (state, action) => {
      state.loadingEdit = false;
      state.errorEditing = action.payload;
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getUserQuestionsPending,
  getUserQuestionsSuccess,
  getUserQuestionsFail,
  getQuestionsFail,
  getQuestionsPending,
  getQuestionsSuccess,
  createQuestionFail,
  createQuestionPending,
  createQuestionSuccess,
  editQuestionFail,
  editQuestionPending,
  editQuestionSuccess,
  clearPaymentError
} = questionsSlice.actions;
export default questionsSlice.reducer;
