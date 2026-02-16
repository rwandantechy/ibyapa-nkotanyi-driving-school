import TrafficVideo from "../models/trafficVideos.js";

class TrafficVideosService {
  static async createVideo(videoData) {
    const video = await TrafficVideo.create(videoData);
    return video;
  }

  static async getAllVideos() {
    const videos = await TrafficVideo.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return videos;
  }

  static async getVideoById(id) {
    const video = await TrafficVideo.findById(id);
    return video;
  }

  static async deleteVideo(id) {
    const video = await TrafficVideo.findByIdAndDelete(id);
    return video;
  }

  static async updateVideo(id, updateData) {
    const video = await TrafficVideo.findByIdAndUpdate(id, updateData);
    return video;
  }
}
export default TrafficVideosService;
