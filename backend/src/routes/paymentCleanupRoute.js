import express from "express";
import PaymentCleanupController from "../controllers/paymentCleanupController.js";
import IsAllowed from "../middlewares/verify.js";

const router = express.Router();

// All routes require admin authentication
router.use(IsAllowed.verifyAdmin);

router.post("/move-failed", PaymentCleanupController.moveFailedPayments);

router.post(
  "/move-exam-expired",
  PaymentCleanupController.moveExamExpiredPayments
);

router.get("/stats", PaymentCleanupController.getFailedPaymentsStats);

router.post("/run-complete", PaymentCleanupController.runCompleteCleanup);

export default router;
