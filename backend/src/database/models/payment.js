import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    
  },

  currency: { type: String, default: "RWF" },
  paymentMethod: {
    type: String,
    enum: ["MOMO", "AIRTEL", "CARD"],
    required: true,
  },
  uniqueTransactionId: {
    type: String,
    required: true,
  },

  language: {
    type: String,
    default: "rw",
    required: true,
  },

  subscription_type: {
    type: String,
    enum: ["two-exams", "five-exams", "daily", "weekly", "two-weekly", "monthly"],
    required: true,
  },
  paymentStatus: {
    type: Boolean,
    default: false,
    required: true,
  },
 
  subscriptionEnd: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attemptedExams: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;


