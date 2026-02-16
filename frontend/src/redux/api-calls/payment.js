import axios from "axios";
import {
  paymentFailed,
  paymentPending,
  paymentSuccess,
  getPaymentsFailed,
  getPaymentsPending,
  getPaymentsSuccess,
  approveOrRejectFailed,
  approveOrRejectPending,
  approveOrRejectSuccess,

} from "../reducers/paymentReducer";
import { url } from "../../constants/url";

export const pay = async (token, data, paymentType, dispatch) => {

  dispatch(paymentPending());
  try {
    const typeOfPayment =
      paymentType === "momo"
        ? "momo-payment"
        : paymentType === "airtel"
        ? "airtel-payment"
        : "card-payment";
    
    const res = await axios.post(`${url}/payment/${typeOfPayment}`, data, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    
    
    dispatch(paymentSuccess(res.data));
    
    // Return the response data
    return res.data; 
  } catch (error) {
    dispatch(paymentFailed());
    throw error; 
  }
};
export const getAllPayments = async (token, dispatch) => {
  dispatch(getPaymentsPending());
  try {
  const res = await axios.get(`${url}/payment/all-payments`, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(getPaymentsSuccess(res.data));
  } catch (error) {
    dispatch(getPaymentsFailed(error));
  }

};
export const approveOrRejectPayment = async (token, id, paymentStatus, dispatch) => {
  dispatch(approveOrRejectPending());
  try {
    const res = await axios.post(
      `${url}/payment/approve-reject/${id}`,
      { paymentStatus },
      {
        headers: { token: `Bearer ${token}` },
      }
    );
    dispatch(approveOrRejectSuccess(res.data));
  } catch (error) {
    dispatch(approveOrRejectFailed(error));
  }
};

export const checkPaymentStatus = async (token, reqRef) => {
  try {
    const res = await axios.post(`${url}/payment/check-payment-status`, {
      req_ref: reqRef
    }, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    
    return res.data;
  } catch (error) {
    console.log("Status check error:", error.message);
    throw error;
  }
};
