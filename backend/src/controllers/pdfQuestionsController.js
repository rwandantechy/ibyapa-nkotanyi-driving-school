import PdfQuestionsService from "../database/services/pdfQuestionsService.js";
import response from "../utils/response.js";
import cloudinary from "../utils/cloudinary.js";
import Payment from "../database/models/payment.js";

class PdfQuestionsController {
  static async uploadNewPdf(req, res) {
    const user = req.user;
    if (!req.file) {
      return response(res, 400, "Please upload a pdf file", null, "BAD_REQUEST");
    }
    try {

      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.file = result.secure_url;
      const question = await PdfQuestionsService.uploadNewPdf({
        ...req.body,
        user: user.id,
        language: req.body.language,
      });
      return response(res, 201, "Pdf added successfully", question);
    } catch (error) {
      console.error("Error uploading pdf:", error);
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }


static async getAllPdf(req, res) {
  try {
    const { role: userRole, id: userId } = req.user;
    let pdfs;

    if (userRole === "admin") {
      // Admins get access to all PDFs
      pdfs = await PdfQuestionsService.getAllPdf();
    } else {
      // Regular users get PDFs based on their payment plan language and validity
      const userPayment = await Payment.findOne({ user: userId, paymentStatus: true }).sort({ createdAt: -1 });

      // Check if the user has a valid, active subscription of a specific type
      if (!userPayment || !["daily", "weekly", "two-weekly", "monthly"].includes(userPayment.subscription_type)) {
        return response(res, 401, "You are not subscribed to an active time-based plan.", null, "UNAUTHORIZED");
      }

      // Check if the subscription has expired
      const currentDate = new Date();
      if (userPayment.subscriptionEnd && new Date(userPayment.subscriptionEnd) < currentDate) {
        // Expired subscription: set paymentStatus to false and save immediately
        userPayment.paymentStatus = false;
        await userPayment.save();
        return response(res, 401, "Your subscription has expired. Please renew to access PDFs.", null, "UNAUTHORIZED");
      }

      // Ensure that language preference is set
      if (!userPayment.language) {
        return response(res, 400, "No valid language preference found for this payment plan.", null, "BAD_REQUEST");
      }

      const preferredLanguage = userPayment.language;

      // Fetch PDFs only in the user's payment plan language
      pdfs = await PdfQuestionsService.getAllPdf({ language: preferredLanguage });
    }

    return response(res, 200, "PDFs successfully retrieved", pdfs);
  } catch (error) {
    console.error("Error retrieving PDFs:", error);
    return response(res, 500, error.message || "An error occurred while fetching PDFs", null, "SERVER_ERROR");
  }
}



  static async deleteSinglePdf(req, res) {
    const { id } = req.params;
    try {
      const pdf = await PdfQuestionsService.getPdfById(id);
      if (!pdf) return response(res, 404, "Pdf not found", null, "NOT_FOUND");
      await cloudinary.uploader.destroy(pdf.file);
      await PdfQuestionsService.deletePdf(id);
      return response(res, 200, "Pdf deleted successfully", {});
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async getSinglePdf(req, res) {
    const { id } = req.params;
    try {
      const pdf = await PdfQuestionsService.getPdfById(id);
      if (!pdf) return response(res, 404, "Pdf not found", null, "NOT_FOUND");
      return response(res, 200, "Pdf retrieved successfully", pdf);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async updateSinglePdf(req, res) {
    const { id } = req.params;
  try {
      const pdf = await PdfQuestionsService.getPdfById(id);
      if (!pdf) return response(res, 404, "Pdf not found", null, "NOT_FOUND");
      if (req.file) {
        if (pdf.file !== "" && pdf.file !== null) {
          await cloudinary.uploader.destroy(pdf.file);
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        req.body.file = result.secure_url;
      }
      const newPdf = {
        title: req.body.title,
        file: req.body.file ? req.body.file : pdf.file,
        language: req.body.language,
      };

      const updatedPdf = await PdfQuestionsService.updatePdf(id, newPdf);
      return response(res, 200, "Pdf updated successfully", updatedPdf);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }
}
export default PdfQuestionsController;

