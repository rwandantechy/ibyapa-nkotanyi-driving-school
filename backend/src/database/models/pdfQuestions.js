import mongoose from "mongoose";

const pdfQuestionsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  language:{
    type: String,
    required: true,
    default: "rw"
  },
  file: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  user: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PdfQuestion = mongoose.model("PdfQuestion", pdfQuestionsSchema);
export default PdfQuestion;
