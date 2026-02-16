import axios from "axios";
import {
  getPdfsFailure,
  getPdfsPending,
  getPdfsSuccess,
  createPdfPending,
  createPdfFailure,
  createPdfSuccess,
  editPdfFailure,
  editPdfPending,
  editPdfSuccess,
} from "../reducers/pdfReducer";
import { url } from "../../constants/url";

export const getAllPdfs = async (token, dispatch) => {
  dispatch(getPdfsPending());
  try {
   
    const res = await axios.get(`${url}/pdf/get-all-pdf`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(getPdfsSuccess(res.data));
  } catch (error) {
    if (error.response.data !== undefined) {
      dispatch(getPdfsFailure(error.response.data));
    }
    dispatch(getPdfsFailure(error));
  }
};

export const getAllPdfsAdmin = async (token, dispatch) => {
  dispatch(getPdfsPending());
  try {
    const res = await axios.get(`${url}/pdf/get-pdfs-admin`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    dispatch(getPdfsSuccess(res.data));
    return res.data;
  } catch (error) {
    if (error.response.data !== undefined) {
      dispatch(getPdfsFailure(error.response.data));
    }
    dispatch(getPdfsFailure(error));
  }
};

export const createPdf = async (data, token, dispatch) => {
  dispatch(createPdfPending());
  try {
    console.log("Data to be  saved ",data);
    const res = await axios.post(`${url}/pdf/upload-pdf`, data, {
      headers: {
        token: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(createPdfSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createPdfFailure(error));
  }
};

export const deletePdf = async (id, token) => {
  try {
    const res = await axios.delete(`${url}/pdf/delete-pdf/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updatePdf = async (id, data, token, dispatch) => {
  dispatch(editPdfPending());
  
  try {
    const res = await axios.patch(`${url}/pdf/update-pdf/${id}`, data, {
      headers: {
        token: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    editPdfSuccess(res.data);
    return res.data;
  } catch (error) {
    editPdfFailure(error);
  }
};
