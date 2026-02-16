import performanceService from "../database/services/performanceService.js";
import Payment from "../database/models/payment.js";
import User from "../database/models/user.js";

class PerformanceController {
  static async addPerformance(req, res) {
    try {
      const { examName, marks } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!examName || marks === undefined) {
        return res.status(400).json({ message: req.t("invalid_exam_data") });
      }

      // Check user existence
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: req.t("user_not_found") });
      }

      // Check subscription status
      const subscriptionStatus =
        await PerformanceController.checkSubscriptionStatus(userId, req);
      if (!subscriptionStatus.isValid) {
        return res.status(403).json({ message: subscriptionStatus.message });
      }

      // Create performance record
      const performanceData = { examName, marks };
      const newPerformance = await performanceService.createPerformance(
        userId,
        performanceData
      );

      // Update subscription usage if necessary
      if (subscriptionStatus.needsUpdate) {
        await PerformanceController.updateSubscriptionUsage(
          userId,
          subscriptionStatus.subscriptionType
        );
      }

      return res.status(201).json(newPerformance);
    } catch (error) {
      console.error("Error in addPerformance:", error);
      return res.status(500).json({
        message: req.t("add_performance_failed"),
        error: error.message,
      });
    }
  }

  static async checkSubscriptionStatus(userId, req) {
    const payment = await Payment.findOne({
      user: userId,
      paymentStatus: true,
    });
    if (!payment) {
      const user = await User.findById(userId);
      if (user.hasAttemptedTrial) {
        return {
          isValid: false,
          message: req.t("free_trial_used_no_subscription"),
        };
      }
      return { isValid: true, needsUpdate: true, subscriptionType: "trial" };
    }

    const currentDate = new Date();
if (
  ["daily", "weekly", "two-weekly", "monthly"].includes(payment.subscription_type)
) {
  if (payment.subscriptionEnd && payment.subscriptionEnd < currentDate) {
    return {
      isValid: false,
      message: req.t("subscription_expired"),
    };
  }
  return { isValid: true, needsUpdate: true, subscriptionType: payment.subscription_type };
}
 
    else {
      const maxAttempts = PerformanceController.getMaxAttempts(
        payment.subscription_type
      );
      if (payment.attemptedExams >= maxAttempts) {
        return {
          isValid: false,
          message: req.t("exam_attempt_limit_exceeded"),
        };
      }
      return {
        isValid: true,
        needsUpdate: true,
        subscriptionType: payment.subscription_type,
      };
    }
  }

  static async updateSubscriptionUsage(userId, subscriptionType) {
    if (subscriptionType === "trial") {
      await User.findByIdAndUpdate(userId, {
        hasAttemptedTrial: true,
        $inc: { trialAttempts: 1 },
      });
    } else {
      await Payment.findOneAndUpdate(
        { user: userId, paymentStatus: true },
        { $inc: { attemptedExams: 1 } }
      );
    }
  }

  static getMaxAttempts(subscriptionType) {
    const SubscriptionTypes = {
      "two-exams": 2,
      "five-exams": 5,
    };
    return SubscriptionTypes[subscriptionType] || 0;
  }

  static async getPerformances(req, res) {
    try {
      const userId = req.user.id;
      const performances = await performanceService.getUserPerformances(userId);
      return res.status(200).json(performances);
    } catch (error) {
      return res.status(500).json({
        message: req.t("retrieve_performance_failed"),
        error: error.message,
      });
    }
  }


  
}

export default PerformanceController;
