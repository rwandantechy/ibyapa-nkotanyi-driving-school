import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    createdUser: null,
    loggedUser: null,
    loading: false,
    signinError: null,
    signupError: null,
    users: [],
    updateUserError: null,
    updateUserLoading: false,
   searchUser: null,

    searchError: null,
    resetPasswordLoading: false,
    resetPasswordError: null,

  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.signinError = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.signinError = null;
      state.loggedUser = action.payload;
    },
    loginFail: (state, action) => {
      state.signinError = action.payload;
      state.loading = false;
    },

    signupStart: (state) => {
      state.loading = true;
      state.signupError = null;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.signupError = null;
      state.createdUser = action.payload;
    },
    signupFail: (state, action) => {
      state.signupError = action.payload;
      state.loading = false;
    },
    getUsersPending: (state) => {
      state.loading = true;
    },
    getUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    getUsersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    editUserPending: (state) => {
      state.updateUserLoading = true;
      state.updateUserError = null;
    },
    editUserSuccess: (state, action) => {
      state.updateUserLoading = false;
      state.loggedUser = action.payload;
      state.updateUserError = null;
    },
    editUserFailure: (state, action) => {
      state.updateUserError = action.payload;
      state.updateUserLoading = false;
    }
    ,
    searchUserPending: (state) => {
      state.loading = true;
      state.searchError = null;
      state.searchUser = null;
    },
    searchUserSuccess: (state, action) => {
      state.loading = false;
      state.searchUser = action.payload;
      state.searchError = null;
    },
    searchUserFail: (state, action) => {
      state.loading = false;
      state.searchError = action.payload;
      state.searchUser = null;
    },


    resetPasswordPending: (state) => {
      state.resetPasswordLoading = true;
      state.resetPasswordError = null;
    },
    resetPasswordSuccess: (state) => {
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
    },
    resetPasswordFail: (state, action) => {
      state.resetPasswordLoading = false;
      state.resetPasswordError = action.payload;
    },

  },
});

export const {
  loginStart,
  loginSuccess,
  loginFail,
  signupFail,
  signupStart,
  signupSuccess,
  getUsersPending,
  getUsersFail,
  getUsersSuccess,
  editUserPending,
  editUserSuccess,
  editUserFailure,
  searchUserPending,
  searchUserSuccess,
  searchUserFail,
  resetPasswordPending,
  resetPasswordSuccess,
  resetPasswordFail,

} = userSlice.actions;
export default userSlice.reducer;
