import express from "express";
import TrafficQuestionsController from "../controllers/trafficQuestionsController.js";
import IsAllowed from "../middlewares/verify.js";
import HasPaid from "../middlewares/verifyPayment.js";

const trafficRoute = express.Router();


trafficRoute.get(
  "/get-questions",
  IsAllowed.verifyToken,                   
  HasPaid.checkPaymentEnd,                 
  TrafficQuestionsController.getTwentyQuestions  
);


// Admin and specific access routes for traffic questions management
trafficRoute.post(
  "/add-question",
  (req, res, next) => IsAllowed.checkPermission(req, res, next, "add-question"),
  TrafficQuestionsController.addQuestion
);

trafficRoute.get(
  "/get-questions-admin",
  IsAllowed.verifyAdmin,
  TrafficQuestionsController.getAllQuestions
);

trafficRoute.get(
  "/get-single-question/:id",
  IsAllowed.verifyAdmin,
  TrafficQuestionsController.getSingleQuestion
);

trafficRoute.delete(
  "/delete-question/:id",
  IsAllowed.verifyAdmin,
  TrafficQuestionsController.deleteSingleQuestion
);

trafficRoute.patch(
  "/update-question/:id",
  IsAllowed.verifyAdmin,
  TrafficQuestionsController.updateSingleQuestion
);

export default trafficRoute;
