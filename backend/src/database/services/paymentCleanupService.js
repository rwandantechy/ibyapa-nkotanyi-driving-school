import mongoose from "mongoose";
import Payment from "../models/payment.js";

class PaymentCleanupService {

  static async moveFailedPayments(minutes = 30) {
    try {
  console.log(`[Cleanup] Checking for unpaid and expired payments older than ${minutes} minutes...`);

      // Calculate time cutoff
      const cutoffObjectId = new mongoose.Types.ObjectId(
        Math.floor((Date.now() - minutes * 60 * 1000) / 1000).toString(16) + "0000000000000000"
  );
    // For debugging: console.log("[Cleanup] Cutoff ObjectId:", cutoffObjectId);
      // Move all unpaid (paymentStatus=false, attemptedExams=0) to failedpayments
      const unpaidPayments = await Payment.find({
        paymentStatus: false,
        attemptedExams: 0,
        _id: { $lt: cutoffObjectId }
      });

      // Move all other expired (any plan, any status except unpaid) to expiredpayments
      const expiredPayments = await Payment.find({
        $and: [
          { _id: { $lt: cutoffObjectId } },
          { $or: [
            // time-based plans: subscriptionEnd <= now
            { subscription_type: { $in: ["daily", "weekly", "two-weekly", "monthly"] }, subscriptionEnd: { $lte: new Date() } },
            // exam-based plans: attemptedExams >= planLimit
            { subscription_type: "one-time", attemptedExams: { $gte: 1 } },
            { subscription_type: "two-exams", attemptedExams: { $gte: 2 } },
            { subscription_type: "five-exams", attemptedExams: { $gte: 5 } }
          ] },
          // Exclude unpaid
          { attemptedExams: { $ne: 0 } }
        ]
      });

      const allToMove = [
        ...unpaidPayments.map(p => ({ ...p.toObject(), reason: "unpaid" })),
        ...expiredPayments.map(p => ({ ...p.toObject(), reason: "expired" })),
      ];

      if (allToMove.length === 0) {
        console.log("[Cleanup] No unpaid or expired payments found.");
        return { moved: 0, deleted: 0 };
      }

      // Create flexible schemas for archives (strict: false keeps any fields)
      const archiveSchema = new mongoose.Schema({}, { strict: false });
      const FailedPayment = mongoose.models.FailedPayment || mongoose.model('FailedPayment', archiveSchema, 'failedpayments');
      const ExpiredPayment = mongoose.models.ExpiredPayment || mongoose.model('ExpiredPayment', archiveSchema, 'expiredpayments');

      // Move unpaid to failedpayments (skip duplicates)
      if (unpaidPayments.length > 0) {
        await FailedPayment.insertMany(
          unpaidPayments.map(p => ({
            ...p.toObject(),
            originalPaymentStatus: p.paymentStatus,
            paymentStatus: false,
            movedToFailedAt: new Date(),
          })),
          { ordered: false }
        );
        console.log(`[Cleanup] Archived ${unpaidPayments.length} unpaid payments.`);
      }

      // Move expired to expiredpayments (skip duplicates)
      if (expiredPayments.length > 0) {
        await ExpiredPayment.insertMany(
          expiredPayments.map(p => ({
            ...p.toObject(),
            originalPaymentStatus: p.paymentStatus,
            paymentStatus: false,
            movedToFailedAt: new Date(),
          })),
          { ordered: false }
        );
        console.log(`[Cleanup] Archived ${expiredPayments.length} expired payments.`);
      }

      // Delete from main collection
      const deleteResult = await Payment.deleteMany({
        _id: { $lt: cutoffObjectId },
        $or: [
          { paymentStatus: false, attemptedExams: 0 },
          // time-based plans: subscriptionEnd <= now
          { subscription_type: { $in: ["daily", "weekly", "two-weekly", "monthly"] }, subscriptionEnd: { $lte: new Date() }, attemptedExams: { $ne: 0 } },
          // exam-based plans: attemptedExams >= planLimit
          { subscription_type: "one-time", attemptedExams: { $gte: 1 } },
          { subscription_type: "two-exams", attemptedExams: { $gte: 2 } },
          { subscription_type: "five-exams", attemptedExams: { $gte: 5 } }
        ]
      });

  console.log(`[Cleanup] Removed ${deleteResult.deletedCount} unpaid/expired payments from main database.`);
  console.log(`[Cleanup] Unpaid/expired payment cleanup complete.`);

      return { moved: allToMove.length, deleted: deleteResult.deletedCount };

    } catch (error) {
      console.error(" Error in moveFailedPayments:", error.message);
      throw error;
    }
  }

 
  static async moveExamExpiredPayments() {
    try {
  console.log(`[Cleanup] Checking for exam-expired payments...`);
      // Find payments that have reached their exam limits OR time-based subscriptions that have ended
      const now = new Date();

      // Determine expired by exam limits OR expired by time-based plans.
      // For time-based plans we support two cases:
      //  1) subscriptionEnd is set and <= now
      //  2) subscriptionEnd missing/empty — infer expiry from createdAt + plan duration
      const oneDay = 24 * 60 * 60 * 1000;
      const durations = {
        daily: 1 * oneDay,
        weekly: 7 * oneDay,
        "two-weekly": 14 * oneDay,
        monthly: 30 * oneDay 
      };

      const timeBasedOrClauses = [];
      // clauses for explicit subscriptionEnd <= now
      timeBasedOrClauses.push({ subscription_type: { $in: ["daily", "weekly", "two-weekly", "monthly"] }, subscriptionEnd: { $lte: now } });
      // clauses for missing subscriptionEnd but createdAt older than plan duration
      Object.entries(durations).forEach(([type, ms]) => {
        timeBasedOrClauses.push({ subscription_type: type, subscriptionEnd: { $exists: false }, createdAt: { $lte: new Date(now - ms) } });
        // also handle null subscriptionEnd explicitly stored as null
        timeBasedOrClauses.push({ subscription_type: type, subscriptionEnd: null, createdAt: { $lte: new Date(now - ms) } });
      });

      const examOrClauses = [
        { subscription_type: "two-exams", attemptedExams: { $gte: 2 } },
        { subscription_type: "five-exams", attemptedExams: { $gte: 5 } }
      ];

      // Find matching payments regardless of paymentStatus so we pick up records
      // where subscriptionEnd was set but paymentStatus may not reflect active/expired label.
      const examExpiredPayments = await Payment.find({
        $or: [
          ...examOrClauses,
          ...timeBasedOrClauses
        ]
      });
      
    

      // Log candidates for time-based subscriptions (for debugging/inspection)
      try {
        const expiredCandidates = await Payment.find({
          subscription_type: { $in: ["daily", "weekly", "two-weekly", "monthly"] }
        }).select("subscription_type subscriptionEnd createdAt");
      } catch (e) {
        console.error("Error fetching expired candidates for logging:", e.message);
      }

  console.log(`[Cleanup] Found ${examExpiredPayments.length} payments expired by exam limits or time.`);

      if (examExpiredPayments.length === 0) {
        console.log("[Cleanup] No exam/time-expired payments found.");
        return { moved: 0, deleted: 0 };
      }

      // Flexible schema for expired payments archive
      const archiveSchema = new mongoose.Schema({}, { strict: false });
      const ExpiredPayment = mongoose.models.ExpiredPayment || mongoose.model('ExpiredPayment', archiveSchema, 'expiredpayments');

      // Prepare data for failed payments collection
      const failedPaymentData = examExpiredPayments.map(payment => ({
        amount: payment.amount,
        phone: payment.phone,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        uniqueTransactionId: payment.uniqueTransactionId,
        language: payment.language,
        subscription_type: payment.subscription_type,
        originalPaymentStatus: payment.paymentStatus,
        paymentStatus: false,
        subscriptionEnd: payment.subscriptionEnd,
        user: payment.user,
        attemptedExams: payment.attemptedExams,
        createdAt: payment.createdAt,
        movedToFailedAt: new Date(),
        reason: (payment.subscriptionEnd && payment.subscriptionEnd <= now) ? "time_expired" : "exam_limit_reached"
      }));

  // Move to expired payments collection
    await ExpiredPayment.insertMany(failedPaymentData);
    console.log(`[Cleanup] Archived ${failedPaymentData.length} exam-expired payments.`);

      // Delete from main collection — include both explicit subscriptionEnd expiries and inferred expiries
      const deleteOrClauses = [
        { subscription_type: "two-exams", attemptedExams: { $gte: 2 } },
        { subscription_type: "five-exams", attemptedExams: { $gte: 5 } },
        // explicit subscriptionEnd <= now
        { subscription_type: { $in: ["daily", "weekly", "two-weekly", "monthly"] }, subscriptionEnd: { $lte: now } }
      ];
      // add inferred expiry clauses (no subscriptionEnd or null, but createdAt older than plan duration)
      Object.entries(durations).forEach(([type, ms]) => {
        deleteOrClauses.push({ subscription_type: type, subscriptionEnd: { $exists: false }, createdAt: { $lte: new Date(now - ms) } });
        deleteOrClauses.push({ subscription_type: type, subscriptionEnd: null, createdAt: { $lte: new Date(now - ms) } });
      });

      const deleteResult = await Payment.deleteMany({
        $or: deleteOrClauses
      });

  console.log(`[Cleanup] Removed ${deleteResult.deletedCount} exam-expired payments from main database.`);
  console.log(`[Cleanup] Exam-expired payment cleanup complete.`);

      return { moved: failedPaymentData.length, deleted: deleteResult.deletedCount };

    } catch (error) {
      console.error("Error in moveExamExpiredPayments:", error.message);
      throw error;
    }
  }

  /**
   * Get statistics about failed payments
   * @returns {Object} - Statistics about failed payments
   */
  static async getFailedPaymentsStats() {
    try {
      // Unpaid: paymentStatus: false, attemptedExams === 0
      const unpaid = await Payment.countDocuments({ paymentStatus: false, attemptedExams: 0 });

      // Expired: combine several sources
      // 1) payments already flagged as failed (paymentStatus: false && attemptedExams > 0) for exam-based
      const expiredFailedFlag = await Payment.countDocuments({
        paymentStatus: false,
        attemptedExams: { $gt: 0 },
        subscription_type: { $in: ["two-exams", "five-exams"] }
      });

      // 2) active payments that are now expired (either exam limits reached or time-based subscriptionEnd passed)
      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      const durations = {
        daily: 1 * oneDay,
        weekly: 7 * oneDay,
        "two-weekly": 14 * oneDay,
        monthly: 30 * oneDay // approximate
      };

      // time-based clauses include explicit subscriptionEnd <= now and inferred expiry when subscriptionEnd missing/null
      const timeClauses = [];
      timeClauses.push({ subscription_type: { $in: ["daily", "weekly", "two-weekly", "monthly"] }, subscriptionEnd: { $lte: now } });
      Object.entries(durations).forEach(([type, ms]) => {
        timeClauses.push({ subscription_type: type, subscriptionEnd: { $exists: false }, createdAt: { $lte: new Date(now - ms) } });
        timeClauses.push({ subscription_type: type, subscriptionEnd: null, createdAt: { $lte: new Date(now - ms) } });
      });

      const expiredActive = await Payment.countDocuments({
        paymentStatus: true,
        $or: [
          { subscription_type: "two-exams", attemptedExams: { $gte: 2 } },
          { subscription_type: "five-exams", attemptedExams: { $gte: 5 } },
          ...timeClauses
        ]
      });

      const expired = expiredFailedFlag + expiredActive;

      // Total failed (legacy): unpaid + expired
      const totalFailed = unpaid + expired;

      // Recent unpaid (last 24h)
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentUnpaid = await Payment.countDocuments({
        paymentStatus: false,
        attemptedExams: 0,
        createdAt: { $gte: since }
      });

      // Recent expired: include failed-flagged expired and active payments that became expired in last 24h
      const recentExpiredFailedFlag = await Payment.countDocuments({
        paymentStatus: false,
        attemptedExams: { $gt: 0 },
        subscription_type: { $in: ["two-exams", "five-exams"] },
        createdAt: { $gte: since }
      });

      // Recent expired: exam-based that reached limits in last 24h OR time-based whose expiry (explicit or inferred) happened in last 24h
      const recentTimeClauses = [];
      // explicit subscriptionEnd that fell within the last 24h
      recentTimeClauses.push({ subscription_type: { $in: ["daily", "weekly", "two-weekly", "monthly"] }, subscriptionEnd: { $lte: now, $gte: since } });
      // inferred recent expiries: createdAt between (since - duration) and (now - duration)
      Object.entries(durations).forEach(([type, ms]) => {
        const start = new Date(since - ms);
        const end = new Date(now - ms);
        recentTimeClauses.push({ subscription_type: type, subscriptionEnd: { $exists: false }, createdAt: { $gte: start, $lte: end } });
        recentTimeClauses.push({ subscription_type: type, subscriptionEnd: null, createdAt: { $gte: start, $lte: end } });
      });

      const recentExpiredActive = await Payment.countDocuments({
        paymentStatus: true,
        $or: [
          { subscription_type: "two-exams", attemptedExams: { $gte: 2 }, createdAt: { $gte: since } },
          { subscription_type: "five-exams", attemptedExams: { $gte: 5 }, createdAt: { $gte: since } },
          ...recentTimeClauses
        ]
      });

      const recentExpired = recentExpiredFailedFlag + recentExpiredActive;
      const recentFailed = recentUnpaid + recentExpired;

      return {
        unpaid,
        expired,
        totalFailed,
        recentUnpaid,
        recentExpired,
        recentFailed,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error getting failed payments stats:", error.message);
      throw error;
    }
  }
}

export default PaymentCleanupService;
