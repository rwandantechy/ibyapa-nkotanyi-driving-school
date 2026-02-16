import mongoose from "mongoose";

const trafficVideosSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ["en", "fr", "rw"],
  },
  date: {
    type: Date,
    default: Date.now,
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

const TrafficVideo = mongoose.model("TrafficVideo", trafficVideosSchema);
export default TrafficVideo;
