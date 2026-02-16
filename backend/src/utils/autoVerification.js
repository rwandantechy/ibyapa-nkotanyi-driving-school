import Payment from "../database/models/payment.js";
import axios from "axios";

class AutoVerification {
  static isRunning = false;
  static intervalId = null;

  // Start automatic verification polling
  static start() {
    if (this.isRunning) {
      console.log("Auto verification already running");
      return;
    }

    console.log("Starting automatic payment verification...");
    this.isRunning = true;

    // Run every 60 seconds
    this.intervalId = setInterval(async () => {
      try {
        await this.checkPendingPayments();
      } catch (error) {
        console.error("Error in auto verification:", error.message);
      }
    }, 60000); // 60 seconds

    // Run immediately on start
    setTimeout(() => {
      this.checkPendingPayments();
    }, 5000); // Wait 5 seconds after start
  }

  // Stop automatic verification
  static stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log(" Stopped automatic payment verification");
  }

  // Check and update pending payments
  static async checkPendingPayments() {
    try {
      // Get pending payments from last 15 minutes only
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const pendingPayments = await Payment.find({
        paymentStatus: false,
        createdAt: { $gte: fifteenMinutesAgo }
      });

      if (pendingPayments.length === 0) {
        return; // No pending payments
      }

      console.log(`Checking ${pendingPayments.length} pending payments`);

      for (const payment of pendingPayments) {
        try {
          const ageInMinutes = (Date.now() - payment.createdAt.getTime()) / (1000 * 60);
          
          // Only check payments older than 1 minute (let them settle)
          if (ageInMinutes >= 1) {
            const result = await this.updatePendingPaymentStatus(payment.uniqueTransactionId);
            if (result.updated) {
              console.log("-------------------------------------------- ");
              console.log(` =============Payment verified=========: ${payment._id}`);
              console.log("-------------------------------------------- ");
            }
          }
        } catch (error) {
          console.error(` Error checking payment ${payment._id}:`, error.message);
        }
      }
    } catch (error) {
      console.error(" Error in checkPendingPayments:", error.message);
    }
  }

  // Update individual payment status
  static async updatePendingPaymentStatus(req_ref) {
    try {
      // Validate req_ref format (UUID v4 should be 36 characters)
      if (!req_ref || req_ref.length !== 36) {
        console.log("Invalid req_ref format:", req_ref);
        return { updated: false, error: "Invalid req_ref format" };
      }

      // First, find the payment by uniqueTransactionId (which stores the req_ref)
      const payment = await Payment.findOne({ uniqueTransactionId: req_ref });
      if (!payment) {
        console.log("Payment not found for req_ref:", req_ref);
        return { updated: false, error: "Payment not found" };
      }

      // Check payment age in minutes
      const ageInMinutes = (Date.now() - payment.createdAt.getTime()) / (1000 * 60);
      console.log(`Payment age: ${ageInMinutes.toFixed(2)} minutes for payment: ${payment._id}`);

      // Security: Only check payments within 15-minute window
      if (ageInMinutes > 15) {
        return { updated: false, reason: "payment_too_old" };
      }

      // Skip if payment is already successful
      if (payment.paymentStatus === true) {
        console.log("Payment already successful, skipping check:", payment._id);
        return { updated: false, reason: "already_successful" };
      }

      // Prepare payload for external API
      const payload = {
        action: "status_check",
        req_ref: req_ref,
        key: process.env.MOMO_KEY,
      };

      // Use correct verify endpoint
      const verifyUrl = 'https://pay.itecpay.rw/api2/verify';
      console.log("Checking external API for payment:", payment._id);

      const { data } = await axios.post(verifyUrl, payload, {
        timeout: parseInt(process.env.VERIFY_TIMEOUT) || 10000 
      });

      const { status, transaction_id } = data?.data || {};

      if (status === "SUCCESSFUL") {
        // Only update if payment is still pending
        if (payment.paymentStatus === false) {
          payment.paymentStatus = true;
          await payment.save();
          console.log("Payment updated to true:", payment._id);
          return { updated: true, status: "SUCCESSFUL", ageInMinutes: ageInMinutes.toFixed(2) };
        }
      } else if (status === "FAILED") {
        console.log("Payment failed according to external API:", payment._id);
        return { updated: false, status: "FAILED", ageInMinutes: ageInMinutes.toFixed(2) };
      } else {
        console.log("Payment still pending according to external API:", payment._id);
        return { updated: false, status: "PENDING", ageInMinutes: ageInMinutes.toFixed(2) };
      }

      return { updated: false, status: status || "UNKNOWN", ageInMinutes: ageInMinutes.toFixed(2) };
    } catch (error) {
      console.error("Error updating payment status for req_ref:", req_ref, "Error:", error.message);
      return { updated: false, error: error.message };
    }
  }
}

export default AutoVerification;
