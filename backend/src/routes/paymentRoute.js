import express from "express";
import PaymentController from "../controllers/paymentController.js";
import IsAllowed from "../middlewares/verify.js";

const paymentRoute = express.Router();

paymentRoute.post('/momo-payment',IsAllowed.verifyToken, PaymentController.momoPayment);
paymentRoute.post("/api/payments/momo-callback", PaymentController.handleMoMoCallback);
paymentRoute.post('/check-payment-status', PaymentController.checkMoMoPaymentStatus);
paymentRoute.post('/check-pending-payments', IsAllowed.verifyAdmin, PaymentController.checkPendingPayments);
paymentRoute.post('/airtel-payment',IsAllowed.verifyToken, PaymentController.airtelMoneyPayment);
paymentRoute.post('/card-payment',IsAllowed.verifyToken, PaymentController.cardPayment);
paymentRoute.get("/all-payments",IsAllowed.verifyAdmin,PaymentController.getAllPaymentsMade);

// Payment analytics (dashboard summary)
paymentRoute.get("/analytics", IsAllowed.verifyAdmin, PaymentController.getPaymentAnalytics);
paymentRoute.get("/single-payment/:id",IsAllowed.verifyAdmin,PaymentController.getSinglePaymentMade);
paymentRoute.post("/approve-reject/:id",IsAllowed.verifyAdmin,PaymentController.approveOrRejectPayment);


export default paymentRoute;