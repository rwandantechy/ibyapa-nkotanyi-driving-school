
import axios from "axios";
import PaymentService from "../database/services/paymentService.js";
import response from "../utils/response.js";
import Payment from "../database/models/payment.js";
import Joi from "joi";
import { v4 as uuidv4 } from 'uuid';

class PaymentController {
  // Get payment analytics (for dashboard)
  static async getPaymentAnalytics(req, res) {
    try {
      // Directly fetch analytics from separate collections for real-time accuracy
      const analytics = await PaymentService.getPaymentAnalytics();
      return response(res, 200, req.t("payment_analytics_success"), analytics);
    } catch (error) {
      return PaymentController.handlePaymentError(req, res, error);
    }
  }
 static getExpectedAmountAndSubscriptionEnd(subscription_type, language) {
  
  const pricing = {
    rw: {
      daily: 2000,
      "two-exams": 300,
      "five-exams": 500,
      weekly: 5000,
      "two-weekly":8000,
      monthly: 10000,
    },
    en_fr: {
      daily: 2000,
      "five-exams": 1000,
      weekly: 6000,
      "two-weekly": 10000,
      monthly: 15000,
    },
  };

  const duration = { daily: 1, weekly: 7, "two-weekly": 14, monthly: 30 };
  const selectedPricing = pricing[language] || pricing.en_fr;
  
  const expectedAmount = selectedPricing[subscription_type] || 0;

  let subscriptionEnd = null;
  if (duration[subscription_type]) {
    subscriptionEnd = new Date(Date.now() + duration[subscription_type] * 24 * 60 * 60 * 1000);
  }

  return { expectedAmount, subscriptionEnd };
}


  static validatePaymentRequest(body) {
    const baseSchema = {
      amount: Joi.number().positive().required(),
      payment_method: Joi.string().valid("momo", "airtel", "card").required(),
      subscription_type: Joi.string()
        .valid("two-exams", "five-exams", "daily", "weekly", "two-weekly", "monthly")
        .required(),
      lang: Joi.string().valid("rw", "en", "fr").optional(),
    };

    if (body.payment_method === "card") {
      baseSchema.card_number = Joi.string().length(16).required();
      baseSchema.card_name = Joi.string().required();
      baseSchema.card_cvc = Joi.string().length(3).required();
      baseSchema.card_expdate = Joi.string().required();
      baseSchema.phone = Joi.string().required();
    } else {
      baseSchema.phone = Joi.string()
        .pattern(/^(078|079|072|073)\d{7}$/)
        .required();
    }

    return Joi.object(baseSchema).validate(body, { allowUnknown: true });
  }


static async momoPayment(req, res) {
    const { error } = PaymentController.validatePaymentRequest(req.body);
    if (error) {
      return response(res, 400, req.t("invalid_input"), error.details);
    }
    try {
      const { expectedAmount, subscriptionEnd } =
        PaymentController.getExpectedAmountAndSubscriptionEnd(
          req.body.subscription_type,
          req.body.lang
        );
      if (req.body.amount !== expectedAmount) {
        return response(res, 400, req.t("invalid_amount"));
      }
      const reqRef = uuidv4();
      const paymentData = {
        amount: req.body.amount,
        phone: req.body.phone,
        key: process.env.MOMO_KEY,
        callback_url: process.env.MOMO_CALLBACK_URL,
        req_ref: reqRef,
      };
      const { data, status } = await axios.post(
        process.env.MOMO_V2_PAYMENT_URL,
        paymentData,
        { timeout: parseInt(process.env.PAYMENT_TIMEOUT) || 180000 }
      );
      if (status === 200 && data?.data?.transaction_id) {
        const momoData = data.data;
        const saved = await PaymentService.addNewMOMOPayment({
          uniqueTransactionId: momoData.transaction_id,
          reqRef,
          amount: momoData.amount,
          language: req.body.lang,
          phone: req.body.phone,
          paymentMethod: "MOMO",
          subscription_type: req.body.subscription_type,
          paymentStatus: momoData.status === "SUCCESSFUL",
          subscriptionEnd,
          user: req.user.id,
        });
        if (momoData.status === "SUCCESSFUL") {
          saved.paymentStatus = true;
          await saved.save();
          return response(res, 200, req.t("payment_successful"), saved);
        } else if (momoData.status === "PENDING") {
          setTimeout(async () => {
            try {
              await PaymentController.updatePendingPaymentStatus(reqRef);
            } catch (error) {
              // Silent error
            }
          }, 60000);
          return response(res, 200, req.t("payment_pending"), { ...saved.toObject(), reqRef: reqRef });
        } else {
          return response(res, 400, req.t("payment_failed"), momoData.status);
        }
      } else {
        return response(
          res,
          400,
          req.t("payment_failed"),
          data?.message || req.t("unexpected_momo_response")
        );
      }
    } catch (error) {
      if (error.response) {
        // Silent error
      }
      return PaymentController.handlePaymentError(req, res, error);
    }
  }
  

  static async handleMoMoCallback(req, res) {
    try {
      const { transaction_id, status } = req.body.data;
  
      const payment = await Payment.findOne({ uniqueTransactionId: transaction_id });
      if (!payment) return res.status(404).json({ message: req.t("payment_not_found") });

      if (status === "SUCCESSFUL") {
        payment.paymentStatus = true;
        await payment.save();
        // Only log errors if needed
        return res.status(200).json({ message: req.t("payment_successful") });
      } else if (status === "FAILED") {
        payment.paymentStatus = false;
        await payment.save();
        return res.status(200).json({ message: req.t("payment_failed") });
      }

      // For PENDING or other statuses, just acknowledge receipt
      return res.status(200).json({ message: req.t("callback_processed") });
    } catch (error) {
      console.error("Callback error:", error.message);
      return res.status(500).json({ message: req.t("server_error") });
    }
  }
  
  static async checkMoMoPaymentStatus(req, res) {
    const { req_ref } = req.body;
    if (!req_ref) return response(res, 400, req.t("missing_reference"));
  
    try {
      const payload = {
        action: "status_check",
        req_ref,
        key: process.env.MOMO_KEY,
      };
      // Use correct verify endpoint
      const verifyUrl = 'https://pay.itecpay.rw/api2/verify';
      const { data } = await axios.post(verifyUrl, payload, {
        timeout: parseInt(process.env.VERIFY_TIMEOUT) || 10000 
      });
  
      const { status, transaction_id } = data?.data || {};
      if (!transaction_id) {
        return response(res, 400, req.t("invalid_verify_response"));
      }

      const payment = await Payment.findOne({ uniqueTransactionId: transaction_id });
      if (!payment) {
        return response(res, 404, req.t("transaction_not_found"));
      }

      if (status === "SUCCESSFUL") {
        payment.paymentStatus = true;
        await payment.save();
        return response(res, 200, req.t("payment_confirmed"), { ...payment.toObject(), status: "SUCCESSFUL" });
      } else if (status === "FAILED") {
        payment.paymentStatus = false;
        await payment.save();
        return response(res, 200, req.t("payment_failed"), { ...payment.toObject(), status: "FAILED" });
      } else {
        return response(res, 200, req.t("payment_still_pending"), { ...payment.toObject(), status: "PENDING" });
      }
    } catch (err) {
      console.error("Verify error:", err.message);
      return response(res, 500, req.t("error_verifying_payment"));
    }
  }

  // Update pending payment status with 15-minute window
  static async updatePendingPaymentStatus(req_ref) {
    try {
      // Validate req_ref format (should be UUID v4)
      if (!req_ref || typeof req_ref !== 'string' || req_ref.length !== 36) {
        return { updated: false, error: "Invalid reference format" };
      }

      // First, find the payment by uniqueTransactionId (which stores the req_ref)
      const payment = await Payment.findOne({ uniqueTransactionId: req_ref });
      if (!payment) {
        return { updated: false, error: "Payment not found" };
      }

      // Check payment age in minutes
      const ageInMinutes = (Date.now() - payment.createdAt.getTime()) / (1000 * 60);

      // Security: Only check payments within 15-minute window
      if (ageInMinutes > 15) {
        return { updated: false, reason: "payment_too_old", ageInMinutes: ageInMinutes.toFixed(2) };
      }

      // Skip if payment is already successful
      if (payment.paymentStatus === true) {
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

      const { data } = await axios.post(verifyUrl, payload, {
        timeout: parseInt(process.env.VERIFY_TIMEOUT) || 10000 // 10 seconds default
      });

      const { status, transaction_id } = data?.data || {};

      if (status === "SUCCESSFUL") {
        // Only update if payment is still pending and within time window
        if (payment.paymentStatus === false && ageInMinutes <= 15) {
          payment.paymentStatus = true;
          await payment.save();
          return { updated: true, status: "SUCCESSFUL" };
        }
      } else if (status === "FAILED") {
        return { updated: false, status: "FAILED" };
      } else {
        return { updated: false, status: "PENDING" };
      }

      return { updated: false, status: status || "UNKNOWN", ageInMinutes: ageInMinutes.toFixed(2) };
    } catch (error) {
      console.error("Error updating payment status for req_ref:", req_ref, "Error:", error.message);
      return { updated: false, error: error.message };
    }
  }

  // Check and update pending payments within 15-minute window
  static async checkPendingPayments() {
    try {
      // Get pending payments from last 15 minutes only
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const pendingPayments = await Payment.find({
        paymentStatus: false,
        createdAt: { $gte: fifteenMinutesAgo }
      });

      // Optionally log batch size in debug mode

      let successCount = 0;
      let errorCount = 0;

      for (const payment of pendingPayments) {
        try {
          const ageInMinutes = (Date.now() - payment.createdAt.getTime()) / (1000 * 60);
          // Skip very recent payments (less than 30 seconds) - let callback handle them
          if (ageInMinutes < 0.5) {
            continue;
          }
          // Check payments within 30 seconds to 15 minutes window
          if (ageInMinutes >= 0.5 && ageInMinutes <= 15) {
            const result = await this.updatePendingPaymentStatus(payment.uniqueTransactionId);
            if (result.updated) {
              successCount++;
            }
          }
        } catch (paymentError) {
          errorCount++;
        }
      }
    } catch (error) {
      console.error("Error checking pending payments:", error);
    }
  }


  static handlePaymentError(req, res, error) {
    return response(res, 500, req.t("payment_failed"), error.message);
  }


  static async airtelMoneyPayment(req, res) {


    const { error } = PaymentController.validatePaymentRequest(req.body);
    if (error) return response(res, 400, req.t("invalid_input"), error.details);

    try {
      const { expectedAmount, subscriptionEnd } =
        PaymentController.getExpectedAmountAndSubscriptionEnd(
          req.body.subscription_type,
          req.body.lang
        );

      if (req.body.amount !== expectedAmount)
        return response(res, 400, req.t("invalid_amount"));

      const paymentData = {
        amount: req.body.amount,
        phone: req.body.phone,
        key: process.env.AIRTEL_MONEY_KEY,
      };
      const paymentResponse = await axios.post(
        process.env.PAYMENT_URL,
        paymentData,
        { timeout: 90000 }
      );

      if (paymentResponse.status === 200) {
        const paymentRes = await PaymentService.addNewAirtelMoneyPayment({
          uniqueTransactionId: paymentResponse.data.data.transID,
          amount: paymentResponse.data.data.amount,
          language: req.body.lang,
          phone: req.body.phone,
          paymentMethod: "AIRTEL",
          subscription_type: req.body.subscription_type,
          paymentStatus: true,
          subscriptionEnd,
          user: req.user.id,
        });
        return response(res, 200, req.t("payment_successful"), paymentRes);
      } else {
        return response(
          res,
          400,
          req.t("payment_failed"),
          paymentResponse.data.message || null
        );
      }
    } catch (error) {
      return PaymentController.handlePaymentError(req, res, error);
    }
  }

  static async cardPayment(req, res) {
    const { error } = PaymentController.validatePaymentRequest(req.body);
    if (error) {
      return response(res, 400, req.t("invalid_input"), error.details);
    }

    try {
      const { expectedAmount, subscriptionEnd } =
        PaymentController.getExpectedAmountAndSubscriptionEnd(
          req.body.subscription_type,
          req.body.lang
        );

      if (req.body.amount !== expectedAmount) {
        return response(res, 400, req.t("invalid_amount"));
      }

      const paymentData = {
        card_number: req.body.card_number,
        card_name: req.body.card_name,
        card_cvc: req.body.card_cvc,
        card_expdate: req.body.card_expdate,
        phone: req.body.phone,
        amount: req.body.amount,
        key: process.env.CARD_PAYMENT_KEY,
      };

      const paymentResponse = await axios.post(
        process.env.PAYMENT_URL,
        paymentData,
        { timeout: 60000 }
      );


      if (paymentResponse.status === 200) {
        const paymentLinkData = paymentResponse.data;

        // Save transaction details to the database
         await PaymentService.addNewCardPayment({
          uniqueTransactionId: paymentLinkData.PCODE,
          amount: paymentLinkData.amount - (paymentLinkData.amount * 0.03),
          language: req.body.lang,
          paymentMethod: "CARD",
          phone: req.user.phone,
          subscription_type: req.body.subscription_type,
          paymentStatus: false,
          currency: "USD",
          subscriptionEnd,
          user: req.user.id,
        });
       
        return response(res, 200, req.t("payment_link_generated"), {
          transactionId:paymentLinkData.PCODE,
          amount: paymentLinkData.amount,
          link: paymentLinkData.link,
          valid_until: paymentLinkData.valid_until,
        });
      } else {
        return response(
          res,
          400,
          req.t("payment_failed"),
          paymentResponse.data.message || req.t("unknown_error")
        );
      }
    } catch (error) {
      return PaymentController.handlePaymentError(req, res, error);
    }
  }



  static async getAllPaymentsMade(req, res) {
  try {
    // Only retrieve active payments from main collection; archived payments are in their own collections
    const payments = await PaymentService.getAllPayments();
    return response(res, 200, req.t("payments_retrieved_success"), payments);
  } catch (error) {
    console.error("Error in getAllPaymentsMade:", error);
    return response(res, 500, req.t("server_error"), null, "SERVER_ERROR");
  }
}


  static async getSinglePaymentMade(req, res) {
    const { id } = req.params;

    try {
      const payment = await PaymentService.getSinglePayment(id);

      if (!payment) {
        return response(res, 404, req.t("payment_not_found"), null);
      }

      return response(res, 200, req.t("payment_retrieved_success"), payment);
    } catch (error) {
      return PaymentController.handlePaymentError(req, res, error);
    }
  }

 
  static async approveOrRejectPayment(req, res) {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    try {
      const payment = await PaymentService.approveOrRejectPayment(
        id,
        paymentStatus
      );

      if (!payment) {
        return response(res, 404, req.t("payment_not_found"), null);
      }

      return response(res, 200, req.t("payment_updated"), payment);
    } catch (error) {
      return PaymentController.handlePaymentError(req, res, error);
    }
  }
}
export default PaymentController;
