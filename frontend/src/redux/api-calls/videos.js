import axios from "axios";

import {
  getVideosPending,
  getVideosSuccess,
  getVideosFail,
  createVideoFail,
  createVideoPending,
  createVideoSuccess,
} from "../reducers/videosReducer";
import { url } from "../../constants/url";

export const getAllVideos = async (token, dispatch) => {
  dispatch(getVideosPending());
 
  try {
    const res = await axios.get(`${url}/videos/get-all-videos`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(getVideosSuccess(res.data));
  } catch (error) {
    if (error.response.data !== undefined) {
      dispatch(getVideosFail(error.response.data));
    }
    dispatch(getVideosFail(error));
  }
};

export const getAllVideosAdmin = async (token, dispatch) => {
  dispatch(getVideosPending());
  try {
    const res = await axios.get(`${url}/videos/get-videos-admin`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(getVideosSuccess(res.data));
    return res.data;
  } catch (error) {
    if (error.response.data !== undefined) {
      dispatch(getVideosFail(error.response.data));
    }
    dispatch(getVideosFail(error));
  }
};

export const createVideo = async (token, data, dispatch) => {
  dispatch(createVideoPending());
  
  try {
    const res = await axios.post(`${url}/videos/create-video`, data, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(createVideoSuccess(res.data));
    return res.data;
  } catch (error) {
    if (error.response.data !== undefined) {
      dispatch(createVideoFail(error.response.data));
    }
    dispatch(createVideoFail(error));
  }
};

export const editVideo = async (token, data, id) => {
  try {
    const res = await axios.patch(`${url}/videos/update-video/${id}`, data, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteVideo = async (id, token) => {
  try {
    const res = await axios.delete(`${url}/videos/delete-video/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
