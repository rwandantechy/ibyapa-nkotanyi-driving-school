

import Payment from "../models/payment.js";
import FailedPayment from "../models/failedPayment.js";
import mongoose from "mongoose";

// Temporary in-file model for new expiredpayments archive (shared flexible schema)
const _archiveSchema = new mongoose.Schema({}, { strict: false });
const ExpiredPayment = mongoose.models.ExpiredPayment || mongoose.model("ExpiredPayment", _archiveSchema, "expiredpayments");


class PaymentService {



  // Get payment analytics using the final, simplified formula set
  static async getPaymentAnalytics() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 1️⃣ Active: payments where paymentStatus=true and not expired
    // Time-based plans include: daily, weekly, two-weekly, monthly
    const activeAgg = await Payment.aggregate([
      { $match: {
        paymentStatus: true,
        $or: [
          // time-based plans: subscriptionEnd > now (or createdAt + duration > now)
          // Explicitly includes 'daily' as a time-based plan
          { subscription_type: { $in: ["daily", "weekly", "two-weekly", "monthly"] }, $or: [ { subscriptionEnd: null }, { subscriptionEnd: { $gt: now } } ] },
          // exam-based plans: attemptedExams < planLimit
          { subscription_type: "two-exams", attemptedExams: { $lt: 2 } },
          { subscription_type: "five-exams", attemptedExams: { $lt: 5 } }
        ]
      } },
      { $group: { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    // 2️⃣ Expired: sum all records in expiredpayments, regardless of plan or status
    const expiredAgg = await ExpiredPayment.aggregate([
      { $group: { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    // 3️⃣ Failed: all records in failedpayments where attemptedExams = 0
    const failedAgg = await FailedPayment.aggregate([
      { $match: { attemptedExams: 0 } },
      { $group: { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    // 4️⃣ Unpaid: failedpayments where paymentStatus=false and attemptedExams=0
    const unpaidAgg = await FailedPayment.aggregate([
      { $match: { paymentStatus: false, attemptedExams: 0 } },
      { $group: { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    // 5️⃣ Total Paid: Active + Expired
    const totalSum = (activeAgg[0]?.sum || 0) + (expiredAgg[0]?.sum || 0);
    const totalCount = (activeAgg[0]?.count || 0) + (expiredAgg[0]?.count || 0);

    // 6️⃣ This Year: payments + expiredpayments, confirmed only, created this year
    const paidYearPayments = await Payment.aggregate([
      { $match: { paymentStatus: true, createdAt: { $gte: startOfYear } } },
      { $group: { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);
    const paidYearExpired = await ExpiredPayment.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      { $group: { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    // 7️⃣ Today: payments + expiredpayments, confirmed only, created today
    const paidTodayPayments = await Payment.aggregate([
      { $match: { paymentStatus: true, createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);
    const paidTodayExpired = await ExpiredPayment.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, sum: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    // 8️⃣ Average Payment: Total Paid / count of all successful transactions
    const avgPayment = totalCount ? (totalSum / totalCount) : 0;

    // 9️⃣ Average Daily Payment: Total Paid / days active
    let averageDailyPayment = 0;
    let hourlyIncome = 0;
    try {
      const firstActive = await Payment.findOne({ paymentStatus: true }).sort({ createdAt: 1 });
      const firstExpired = await ExpiredPayment.findOne().sort({ createdAt: 1 });
      let minDate = null;
      [firstActive, firstExpired].forEach(doc => {
        if (doc && (!minDate || doc.createdAt < minDate)) minDate = doc.createdAt;
      });
      let days = 1;
      if (minDate) {
        days = Math.max(1, Math.ceil((now.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));
      }
      averageDailyPayment = totalSum / days;

      // 🔟 Hourly Income Average
      let hours = 1;
      if (minDate) {
        hours = Math.max(1, (now.getTime() - minDate.getTime()) / (1000 * 60 * 60));
      }
      hourlyIncome = totalSum / hours;
    } catch (e) {
      averageDailyPayment = 0;
      hourlyIncome = 0;
    }

    return {
      total: { sum: totalSum, count: totalCount },
      active: { sum: activeAgg[0]?.sum || 0, count: activeAgg[0]?.count || 0 },
      expired: { sum: expiredAgg[0]?.sum || 0, count: expiredAgg[0]?.count || 0 },
      failed: { sum: failedAgg[0]?.sum || 0, count: failedAgg[0]?.count || 0 },
      unpaid: { sum: unpaidAgg[0]?.sum || 0, count: unpaidAgg[0]?.count || 0 },
      year: {
        sum: (paidYearPayments[0]?.sum || 0) + (paidYearExpired[0]?.sum || 0),
        count: (paidYearPayments[0]?.count || 0) + (paidYearExpired[0]?.count || 0)
      },
      today: {
        sum: (paidTodayPayments[0]?.sum || 0) + (paidTodayExpired[0]?.sum || 0),
        count: (paidTodayPayments[0]?.count || 0) + (paidTodayExpired[0]?.count || 0)
      },
      average: avgPayment,
      averageDailyPayment,
      hourlyIncome
    };
  }
  // Add new MTN MOMO payment
  static async addNewMOMOPayment(paymentData) {
    const payment = await Payment.create(paymentData);
    return payment;
  }

  // Add new Airtel Money payment
  static async addNewAirtelMoneyPayment(paymentData) {
    const payment = await Payment.create(paymentData);
    return payment;
  }

  // Add new Card payment (no logic here, just storing payment data)
  static async addNewCardPayment(paymentData) {
    const payment = await Payment.create(paymentData);
    return payment;
  }

  // Get all payments
  static async getAllPayments() {
    const payments = await Payment.find().populate('user', 'name email').sort({ createdAt: -1 });
    return payments;
  }

  // Get a single payment by ID
  static async getSinglePayment(id) {
    const payment = await Payment.findById(id).populate('user', 'name email');
    return payment;
  }

// Approve or reject payment
static async approveOrRejectPayment(id, paymentStatus) {
  const payment = await Payment.findByIdAndUpdate(
    id,
    { paymentStatus }, 
    { new: true }
  );
  return payment;
}

}

export default PaymentService;