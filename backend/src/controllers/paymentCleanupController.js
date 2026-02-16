import PaymentCleanupService from "../database/services/paymentCleanupService.js";
import response from "../utils/response.js";

class PaymentCleanupController {
  /**
   * Move failed payments to backup collection
   * POST /api/payment-cleanup/move-failed
   */
  static async moveFailedPayments(req, res) {
    try {
      const { minutes = 30 } = req.body; // Default to 30 minutes

      const result = await PaymentCleanupService.moveFailedPayments(minutes);

      return response(res, 200, req.t("cleanup_successful"), {
        message: `Moved ${result.moved} failed payments, deleted ${result.deleted} from main database`,
        moved: result.moved,
        deleted: result.deleted,
        cutoffMinutes: minutes
      });
    } catch (error) {
      console.error("Error in moveFailedPayments:", error.message);
      return response(res, 500, req.t("server_error"), null, "CLEANUP_ERROR");
    }
  }

  /**
   * Move exam-expired payments to backup collection
   * POST /api/payment-cleanup/move-exam-expired
   */
  static async moveExamExpiredPayments(req, res) {
    try {
      const result = await PaymentCleanupService.moveExamExpiredPayments();

      return response(res, 200, req.t("cleanup_successful"), {
        message: `Moved ${result.moved} exam-expired payments, deleted ${result.deleted} from main database`,
        moved: result.moved,
        deleted: result.deleted
      });
    } catch (error) {
      console.error("Error in moveExamExpiredPayments:", error.message);
      return response(res, 500, req.t("server_error"), null, "CLEANUP_ERROR");
    }
  }

  /**
   * Get failed payments statistics
   * GET /api/payment-cleanup/stats
   */
  static async getFailedPaymentsStats(req, res) {
    try {
      const stats = await PaymentCleanupService.getFailedPaymentsStats();

      return response(res, 200, req.t("stats_retrieved_success"), stats);
    } catch (error) {
      console.error("Error in getFailedPaymentsStats:", error.message);
      return response(res, 500, req.t("server_error"), null, "STATS_ERROR");
    }
  }

  /**
   * Run complete cleanup (both failed and exam-expired payments)
   * POST /api/payment-cleanup/run-complete
   */
  static async runCompleteCleanup(req, res) {
    try {
      const { minutes = 30 } = req.body;

      // Run both cleanup operations
      const failedResult = await PaymentCleanupService.moveFailedPayments(minutes);
      const examResult = await PaymentCleanupService.moveExamExpiredPayments();

      const safeFailedMoved = typeof failedResult.moved === 'number' ? failedResult.moved : 0;
      const safeExamMoved = typeof examResult.moved === 'number' ? examResult.moved : 0;
      const safeFailedDeleted = typeof failedResult.deleted === 'number' ? failedResult.deleted : 0;
      const safeExamDeleted = typeof examResult.deleted === 'number' ? examResult.deleted : 0;

      const totalMoved = safeFailedMoved + safeExamMoved;
      const totalDeleted = safeFailedDeleted + safeExamDeleted;

      return response(res, 200, req.t("cleanup_successful"), {
        message: `Complete cleanup finished: ${totalMoved} payments moved, ${totalDeleted} deleted`,
        failedPayments: failedResult,
        examExpiredPayments: examResult,
        total: {
          moved: totalMoved,
          deleted: totalDeleted
        }
      });
    } catch (error) {
      console.error("Error in runCompleteCleanup:", error.message);
      return response(res, 500, req.t("server_error"), null, "CLEANUP_ERROR");
    }
  }
}

export default PaymentCleanupController;
