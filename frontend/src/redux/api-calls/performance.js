import axios from "axios";
import {
  createPerformancePending,
  createPerformanceSuccess,
  createPerformanceFailure,
  getPerformancePending,
  getPerformanceSuccess,
  getPerformanceFailure,
} from "../reducers/performanceReducer";
import { url } from "../../constants/url";

// Save a new performance record
export const savePerformance = async (token, data, dispatch) => {
  dispatch(createPerformancePending());
  try {
    const res = await axios.post(`${url}/performance`, data, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(createPerformanceSuccess(res.data));
  } catch (error) {
    dispatch(createPerformanceFailure(error.response?.data || error.message));
  }
};

// Fetch all performance records for the owner
export const getAllPerformances = async (token, dispatch) => {
  dispatch(getPerformancePending());
  try {
    const res = await axios.get(`${url}/performance/all`, {
     headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(getPerformanceSuccess(res.data));
  } catch (error) {
    dispatch(getPerformanceFailure(error.response?.data || error.message));
  }
};
