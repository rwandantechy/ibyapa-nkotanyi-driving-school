export const getUserRegistrationStats = async (token) => {
  try {
    const res = await axios.get(`${url}/user/registration-stats`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    return null;
  }
};
import {
  loginStart,
  loginSuccess,
  loginFail,
  signupFail,
  signupStart,
  signupSuccess,
  getUsersPending,
  getUsersFail,
  getUsersSuccess,
  searchUserPending,
  searchUserSuccess,
  searchUserFail,
  resetPasswordPending,
  resetPasswordSuccess,
  resetPasswordFail,

 
} from "../reducers/userReducer";
import axios from "axios";
import Cookies from "js-cookie";
import { url } from "../../constants/url";

export const userLogin = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${url}/user/login`, user);
    Cookies.set("jwt", res.data.data.accessToken, { expires: 7 });
    dispatch(loginSuccess(res.data));
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(loginFail(errorMessage));
    return null;
  }
};

export const userSignup = async (user, dispatch) => {
  dispatch(signupStart());

  try {
   
    const res = await axios.post(`${url}/user/signup`, user);
    dispatch(signupSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(signupFail(error));
  }
};

export const getAllUsers = async (token, dispatch) => {
  dispatch(getUsersPending());
  try {
    const res = await axios.get(`${url}/user/get-all-users`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (error) {
    if (error.response.data !== undefined) {
      dispatch(getUsersFail(error.response.data));
    }
    dispatch(getUsersFail(error));
  }
};

export const deleteUser = async (id, token) => {
  try {
    const res = await axios.delete(`${url}/user/delete-user/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateUser = async (id, user, token) => {
  try {
    const res = await axios.patch(`${url}/user/update-user/${id}`, user, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSingleUser = async (id, token) => {
  try {
    const res = await axios.get(`${url}/user/get-user-and-payment/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};


export const assignOrRevokePermissions = async (id, permissions, token) => {
  try {
    const res = await axios.post(
      `${url}/user/grant-or-revoke-permissions/${id}`,
      permissions,
      {
        headers: {
          token: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
}

// Search User by Phone Number
export const searchUserByPhone = (phone, token) => async (dispatch) => {
  dispatch(searchUserPending());
  try {
    
    const res = await axios.get(`${url}/user/get-user/${phone}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(searchUserSuccess(res.data));
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(searchUserFail(errorMessage));
  }
};

export const resetUserPassword = (userId,token, newPassword) => async (dispatch) => {
  dispatch(resetPasswordPending());
  try {
   
    const res = await axios.post(
      `${url}/user/reset-password-by-admin/${userId}`,
      { newPassword, token },
      {
        headers: {
          token: `Bearer ${token}`,
        },
      }
    );
    dispatch(resetPasswordSuccess());
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(resetPasswordFail(errorMessage));
  }
};


