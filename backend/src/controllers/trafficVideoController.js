import response from "../utils/response.js";
import TrafficVideosService from "../database/services/trafficVideosService.js";
import Payment from "../database/models/payment.js";

class TrafficVideosController {
  static async createVideo(req, res) {
   
    const user = req.user;
    try {
      const video = await TrafficVideosService.createVideo({
        title:req.body.title,
        video:req.body.video,
        language:req.body.language,
        user: user.id,
      });
      return response(res, 201, "Video added successfully", video);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

static async getAllVideos(req, res) {
  try {
    const user = req.user;

    // Admins get unrestricted access to all videos
    if (user.role === "admin") {
      const videos = await TrafficVideosService.getAllVideos();
      return response(res, 200, "All videos are displayed for admin", videos);
    }

    // Non-admin users: Check for an active subscription
    const payment = await Payment.findOne({
      user: user.id,
      paymentStatus: true,
  subscription_type: { $in: ["daily", "weekly", "two-weekly", "monthly"] },
    });

    // If no active subscription is found, check for expired subscriptions
    const currentDate = new Date();
    if (payment) {
      // Check if the subscription has expired
      if (payment.subscriptionEnd && new Date(payment.subscriptionEnd) < currentDate) {
        // Set `paymentStatus` to false if expired
        payment.paymentStatus = false;
        await payment.save();
        return response(res, 403, "Your subscription has expired. Please renew to access videos.", null, "FORBIDDEN");
      }

      // Valid active subscription found; fetch videos
      const videos = await TrafficVideosService.getAllVideos();
      return response(res, 200, "All videos are displayed", videos);
    } else {
      // No active subscription found
      return response(res, 403, "Access denied. Please subscribe to access videos.", null, "FORBIDDEN");
    }
  } catch (error) {
    return response(res, 500, error.message || "An error occurred while fetching videos", null, "SERVER_ERROR");
  }
}



  static async getSingleVideo(req, res) {
    const { id } = req.params;
    try {
      const video = await TrafficVideosService.getVideoById(id);
      if (!video)
        return response(res, 404, "Video not found", null, "NOT_FOUND");
      return response(res, 200, "Video retrieved successfully", video);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async deleteSingleVideo(req, res) {
    const { id } = req.params;
    try {
      const video = await TrafficVideosService.getVideoById(id);
      if (!video) {
        return response(res, 404, "Video not found", null, "NOT_FOUND");
      }
      await TrafficVideosService.deleteVideo(id);
      return response(res, 200, "Video deleted successfully", {});
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async updateSingleVideo(req, res) {
    const { id } = req.params;
    try {
      const video = await TrafficVideosService.getVideoById(id);
      if (!video) {
        return response(res, 404, "Video not found", null, "NOT_FOUND");
      }
      const updatedVideo = await TrafficVideosService.updateVideo(id, {
        title: req.body.title,
        video: req.body.video,
        language: req.body.language,
      });
      return response(res, 200, "Video updated successfully", updatedVideo);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }
}
export default TrafficVideosController;
