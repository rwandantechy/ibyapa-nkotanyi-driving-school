import express from "express";
import PdfQuestionsController from "../controllers/pdfQuestionsController.js";
import { upload } from "../utils/multer.js";
import IsAllowed from "../middlewares/verify.js";
import HasPaid from "../middlewares/verifyPayment.js";

const pdfQuestionsRoute = express.Router();

// Route for general access
pdfQuestionsRoute.get(
  "/get-all-pdf",
  IsAllowed.verifyToken,
  (req, res, next) => HasPaid.checkPaymentEnd(req, res, next, true),  // Premium content check
  PdfQuestionsController.getAllPdf
);

// Admin-only routes
pdfQuestionsRoute.get(
  "/get-pdfs-admin",
  IsAllowed.verifyAdmin,
  PdfQuestionsController.getAllPdf
);

pdfQuestionsRoute.post(
  "/upload-pdf",
  upload.single("file"),
  (req, res, next) => IsAllowed.checkPermission(req, res, next, "upload-pdf"),
  PdfQuestionsController.uploadNewPdf
);

pdfQuestionsRoute.get(
  "/get-single-pdf/:id",
  IsAllowed.verifyAdmin,
  PdfQuestionsController.getSinglePdf
);

pdfQuestionsRoute.delete(
  "/delete-pdf/:id",
  IsAllowed.verifyAdmin,
  PdfQuestionsController.deleteSinglePdf
);

pdfQuestionsRoute.patch(
  "/update-pdf/:id",
  upload.single("file"),
  IsAllowed.verifyAdmin,
  PdfQuestionsController.updateSinglePdf
);

export default pdfQuestionsRoute;
