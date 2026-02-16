import axios from "axios";

import {
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
} from "../reducers/questionsReducer";
import { url } from "../../constants/url";

// 20 questions
export const getAllQuestions = async (token, dispatch,lang) => {
  dispatch(getUserQuestionsPending());
  try {
    const res = await axios.get(`${url}/traffic/get-questions`, {
      headers: {
        token: `Bearer ${token}`,
      },
      params:
      {
        lang: lang
      }
    });
    dispatch(getUserQuestionsSuccess(res.data));
  } catch (error) {
    if (error.response.data !== undefined) {
      dispatch(getUserQuestionsFail(error.response.data));
    }
    dispatch(getUserQuestionsFail(error));
  }
};

export const getAdminQuestions = async (token, dispatch) => {
  dispatch(getQuestionsPending());
  try {
    const res = await axios.get(`${url}/traffic/get-questions-admin`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(getQuestionsSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getQuestionsFail(error));
  }
};

export const createQuestion = async (data, token, dispatch) => {
  dispatch(createQuestionPending());
  try {
    const res = await axios.post(`${url}/traffic/add-question`, data, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(createQuestionSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createQuestionFail(error));
  }
};

export const deleteQuestion = async (id, token) => {
  try {
    const res = await axios.delete(`${url}/traffic/delete-question/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateQuestion = (id, data, token) => async (dispatch) => {
  dispatch(editQuestionPending());
 
  try {
    const res = await axios.patch(
      `${url}/traffic/update-question/${id}`,
      data,
      {
          headers: {
        token: `Bearer ${token}`,
      },
      }
    );
    dispatch(editQuestionSuccess(res.data));
    return res.data; 
  } catch (error) {
    dispatch(editQuestionFail(error.response?.data || error.message));
    throw error; 
  }
};