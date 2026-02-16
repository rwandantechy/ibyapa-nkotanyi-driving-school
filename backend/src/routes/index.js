import express from "express";
import userRoute from "./userRoute.js";
import trafficRoute from "./trafficQuestionsRoute.js";
import trafficVideoRoute from "./trafficVideosRoute.js";
import pdfQuestionsRoute from "./pdfQuestionsRoute.js";
import paymentRoute from "./paymentRoute.js";
import performanceRoute from "./performanceRoute.js";
import paymentCleanupRoute from "./paymentCleanupRoute.js";

const route = express.Router();

route.use("/user", userRoute);
route.use("/traffic", trafficRoute);
route.use("/videos", trafficVideoRoute);
route.use("/pdf",pdfQuestionsRoute);
route.use('/payment', paymentRoute);
route.use('/performance', performanceRoute);
route.use('/payment-cleanup', paymentCleanupRoute);


export default route;
