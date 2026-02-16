import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examName: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    dateTaken: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  
);

const performance= mongoose.model("Performance", performanceSchema);
export default performance;
