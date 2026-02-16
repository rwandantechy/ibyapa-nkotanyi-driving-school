import express from "express";
import PerformanceController from "../controllers/performanceController.js";
import IsAllowed from "../middlewares/verify.js";


const performanceRoute = express.Router();

performanceRoute.post(
  "/",
  IsAllowed.verifyToken,
  
  PerformanceController.addPerformance
);

performanceRoute.get(
  "/all",
  IsAllowed.verifyToken,
  PerformanceController.getPerformances
);

export default performanceRoute;
