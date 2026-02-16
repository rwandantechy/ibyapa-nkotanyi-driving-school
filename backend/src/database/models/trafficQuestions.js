import mongoose from "mongoose";

const trafficQuestionsSchema = mongoose.Schema({
  question: {
    description: {
      type: String,
      required: true,
    },
    imageURLs: [
      {
        type: String,
      },
    ],
  },
  options: [
    {
      optionText: { type: String },
      optionImageURL: { type: String },
      is_correct: { type: Boolean, required: true },
    },
  ],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  servedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  language: {
    type: String,
    required: true,
  },
  isTrial: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TrafficQuestion = mongoose.model("TrafficQuestion", trafficQuestionsSchema);
export default TrafficQuestion;
