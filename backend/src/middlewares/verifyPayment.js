
import response from "../utils/response.js";
import Payment from "../database/models/payment.js";
import User from "../database/models/user.js";

// Define subscription types with their maximum attempts
const SubscriptionTypes = {
  TWO_EXAMS: { key: "two-exams", maxAttempts: 2 },
  FIVE_EXAMS: { key: "five-exams", maxAttempts: 5 },
  DAILY: { key: "daily" },
  WEEKLY: { key: "weekly" },
  TWO_WEEKLY: { key: "two-weekly" },
  MONTHLY: { key: "monthly" },
};



class HasPaid {
  static async checkPaymentEnd(req, res, next) {
    try {
      let user = req.user;

      // Validate user existence
      if (!user || !user.id) {
        return response(res, 401, req.t("user_not_found"), null, req.t("unauthorized"));
      }

      const userData = await User.findById(user.id);
      if (!userData) {
        return response(res, 401, req.t("user_not_found"), null, req.t("unauthorized"));
      }

      // Retrieve all active payments for the user
      const activePayments = await Payment.find({
        user: user.id,
        paymentStatus: true,
      }).sort({ subscriptionEnd: -1 });

      if (activePayments.length === 0) {
        // No active payment: check for trial eligibility
        if (!userData.hasAttemptedTrial && userData.trialAttempts === 0) {
          return next(); 
        }
        return response(res, 401, req.t("no_subscription_payment"), null, req.t("unauthorized"));
      }

      // Validate the latest active payment
      const latestPayment = activePayments[0];
      const needsRevoke = HasPaid.validateAccessConditions(latestPayment);

      if (needsRevoke) {
        await HasPaid.revokeAccess(latestPayment);
        return response(res, 401, req.t("subscription_expired_or_attempts_exceeded"), null, req.t("unauthorized"));
      }

      return next(); 
    } catch (error) {
      console.error("Error in payment validation:", error);
      return res.status(500).json({ status: "error", message: req.t("internal_server_error") });
    }
  }

  static validateAccessConditions(paymentInfo) {
    const currentDate = new Date();
    let needsRevoke = false; 

    // Check each subscription type condition individually
    if (paymentInfo.subscription_type === SubscriptionTypes.TWO_EXAMS.key && 
        paymentInfo.attemptedExams >= SubscriptionTypes.TWO_EXAMS.maxAttempts) {
      needsRevoke = true;
    }

    if (paymentInfo.subscription_type === SubscriptionTypes.FIVE_EXAMS.key && 
        paymentInfo.attemptedExams >= SubscriptionTypes.FIVE_EXAMS.maxAttempts) {
      needsRevoke = true;
    }

    if ([SubscriptionTypes.DAILY.key, SubscriptionTypes.WEEKLY.key, SubscriptionTypes.TWO_WEEKLY.key, SubscriptionTypes.MONTHLY.key].includes(paymentInfo.subscription_type) &&
        (!paymentInfo.subscriptionEnd || paymentInfo.subscriptionEnd < currentDate)) {
      needsRevoke = true;
    }

    return needsRevoke;
  }

  static async revokeAccess(paymentInfo) {
    if (!paymentInfo.isSaving) { 
      paymentInfo.isSaving = true;
      paymentInfo.paymentStatus = false;
      await paymentInfo.save();
      paymentInfo.isSaving = false;
    }
  }
}

export default HasPaid;