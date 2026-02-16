import PdfQuestion from "../models/pdfQuestions.js";

class PdfQuestionsService {
  static async uploadNewPdf(questionData) {
    const pdfQuestions = await PdfQuestion.create(questionData);
    return pdfQuestions;
  }

  static async getAllPdf(filter = {}) {
    const pdfs = await PdfQuestion.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return pdfs;
  }

  static async deletePdf(id) {
    const pdf = await PdfQuestion.findByIdAndDelete(id);
    return pdf;
  }

  static async getPdfById(id) {
    const pdf = await PdfQuestion.findById(id);
    return pdf;
  }

  static async updatePdf(id, updateData) {
    const pdf = await PdfQuestion.findByIdAndUpdate(id, updateData, { new: true });
    return pdf;
  }
}

export default PdfQuestionsService;
