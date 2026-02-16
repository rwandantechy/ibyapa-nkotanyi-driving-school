import mongoose from "mongoose";

const failedPaymentSchema = new mongoose.Schema({}, { strict: false });
const FailedPayment = mongoose.models.FailedPayment || mongoose.model("FailedPayment", failedPaymentSchema, "failedpayments");

export default FailedPayment;
