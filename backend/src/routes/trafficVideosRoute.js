import express from "express";
import TrafficVideosController from "../controllers/trafficVideoController.js";
import IsAllowed from "../middlewares/verify.js";
import HasPaid from "../middlewares/verifyPayment.js";

const trafficVideoRoute = express.Router();

// Route for general access
trafficVideoRoute.get(
  "/get-all-videos",
  IsAllowed.verifyToken,
  (req, res, next) => HasPaid.checkPaymentEnd(req, res, next, true),  
  TrafficVideosController.getAllVideos
);

// Admin-only routes
trafficVideoRoute.get(
  "/get-videos-admin",
  IsAllowed.verifyAdmin,
  TrafficVideosController.getAllVideos
);
// create video
trafficVideoRoute.post(
  "/create-video",
  IsAllowed.verifyAdmin,
  TrafficVideosController.createVideo
);
trafficVideoRoute.get(
  "/get-single-video/:id",
  IsAllowed.verifyAdmin,
  TrafficVideosController.getSingleVideo
);

trafficVideoRoute.delete(
  "/delete-video/:id",
  IsAllowed.verifyAdmin,
  TrafficVideosController.deleteSingleVideo
);

trafficVideoRoute.patch(
  "/update-video/:id",
  IsAllowed.verifyAdmin,
  TrafficVideosController.updateSingleVideo
);

export default trafficVideoRoute;
