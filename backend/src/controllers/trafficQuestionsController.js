import TrafficQuestionService from "../database/services/trafficQuestionService.js";
import Payment from "../database/models/payment.js";
import User from "../database/models/user.js";
import response from "../utils/response.js";

class TrafficQuestionsController {
  // Add a new question
  static async addQuestion(req, res) {
    const { id } = req.user;

    try {
      const { question, options } = req.body;

      // Check if required fields are present
      if (
        !question ||
        (!question.description && !question.imageURLs) ||
        !question.language 
      ) {
        console.error(
          "Validation Error: Missing required fields in 'question'"
        );
        return response(
          res,
          400,
          "Invalid 'question' object. Ensure 'description' and 'language' fields are provided.",
          null,
          "BAD_REQUEST"
        );
      }

      // Check if options array is valid
      if (!Array.isArray(options) || options.length < 2) {
        console.error(
          "Validation Error: Options array is invalid or has less than 2 entries"
        );
        return response(
          res,
          400,
          "Options should be an array with at least 2 entries.",
          null,
          "BAD_REQUEST"
        );
      }

      // Validate each option
      const areOptionsValid = options.every((option, index) => {
        if (!option.optionText && !option.optionImageURL) {
          console.error(
            `Validation Error: Option ${
              index + 1
            } is missing 'optionText' or 'optionImageURL'`
          );
          return false;
        }
        if (typeof option.is_correct !== "boolean") {
          console.error(
            `Validation Error: Option ${
              index + 1
            } has an invalid 'is_correct' value`
          );
          return false;
        }
        return true;
      });

      if (!areOptionsValid) {
        return response(
          res,
          400,
          "Each option must contain either 'optionText' or 'optionImageURL' and a valid 'is_correct' boolean.",
          null,
          "BAD_REQUEST"
        );
      }

      const questionData = {
        question: {
          description: question.description,
          imageURLs: question.imageURLs || [],
        },
        options: options,
        uploadedBy: id,
        isTrial: question.isTrial,
        language: question.language,
      };

      const newQuestion = await TrafficQuestionService.addNewQuestion(
        questionData
      );
      return response(res, 201, "Question added successfully", newQuestion);
    } catch (error) {
      console.error("Error in addQuestion controller:", error);
      return response(
        res,
        500,
        error.message || "An error occurred while adding the question.",
        null,
        "SERVER_ERROR"
      );
    }
  }

  // Get 20 questions based on user subscription and language preferences
  static async getTwentyQuestions(req, res) {
    let questions;
    try {
      const userId = req.user.id;
     
      // Step 1: Fetch the user's latest payment details
      const userPayment = await Payment.findOne({ user: userId }).sort({
        createdAt: -1,
      });
      
      //fetch user data
      let userData = await User.findOne({ _id: userId });
     
      let hasAttemptedTrial = userData.hasAttemptedTrial;
      let trialAttempts = userData.trialAttempts;
      // Step 2: Check if the user has no payment record and return trial questions if so
      if (
        userPayment === null &&
        hasAttemptedTrial === false &&
        trialAttempts === 0
      ) {
       
        // Fetch up to 20 trial questions in the user's preferred language
        const questions = await TrafficQuestionService.getTrialQuestions({
          language: req.user.lang,
        });
        return response(
          res,
          200,
          "Trial questions fetched successfully",
          questions
        );
      }

      const currentDate = Date.now();

      // Check specific subscription types and usage limits
      if (
        (userPayment.subscription_type === "2-exams" &&
          userPayment.attemptedExams >= 2) ||
        (userPayment.subscription_type === "5-exams" &&
          userPayment.attemptedExams >= 5)
      ) {
        // Set paymentStatus to false if the maximum attempts have been reached
        if (userPayment.paymentStatus) {
          userPayment.paymentStatus = false;
          await userPayment.save();
        }
        return response(
          res,
          401,
          "You have reached the maximum number of exam attempts for your subscription",
          null,
          "UNAUTHORIZED"
        );
      }

      // Check if the subscription is a time-based plan and if it has expired
      if (
        ["daily", "weekly", "two-weekly", "monthly"].includes(
          userPayment.subscription_type
        ) &&
        userPayment.subscriptionEnd &&
        new Date(userPayment.subscriptionEnd).getTime() < currentDate
      ) {
        // Set paymentStatus to false if the subscription has expired
        if (userPayment.paymentStatus) {
          userPayment.paymentStatus = false;
          await userPayment.save();
        }
        return response(
          res,
          401,
          "Your subscription has expired or is invalid",
          null,
          "UNAUTHORIZED"
        );
      }

      const isPaidUser =
        userPayment.paymentStatus &&
        (!userPayment.subscriptionEnd ||
          new Date(userPayment.subscriptionEnd).getTime() > currentDate);

      // Step 3: Determine the language to fetch questions in
      const language = isPaidUser ? userPayment.language : req.user.lang;

      if (!isPaidUser && hasAttemptedTrial === false && trialAttempts === 0) {
       
         
        questions = await TrafficQuestionService.getTrialQuestions({
          language,
        });
      } else {
        // Fetch up to 20 questions based on the user's subscription
        questions = await TrafficQuestionService.getQuestions(
          { language },
          isPaidUser
        );
      }

      return response(res, 200, "Questions fetched successfully", questions);
    } catch (error) {
      console.error("Error fetching questions:", error.message || error);
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  // Retrieve all questions with details of the uploader
  static async getAllQuestions(req, res) {
    try {
      const questions = await TrafficQuestionService.getAllQuestions();
      return response(res, 200, "Questions retrieved successfully", questions);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  // Retrieve a single question by ID
  static async getSingleQuestion(req, res) {
    const { id } = req.params;
    try {
      const question = await TrafficQuestionService.getQuestionById(id);
      if (!question)
        return response(res, 404, "Question not found", null, "NOT_FOUND");
      return response(res, 200, "Question retrieved successfully", question);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  // Delete a single question by ID
  static async deleteSingleQuestion(req, res) {
    const { id } = req.params;
    try {
      const question = await TrafficQuestionService.getQuestionById(id);
      if (!question) {
        return response(res, 404, "Question not found", null, "NOT_FOUND");
      }
      await TrafficQuestionService.deleteQuestion(id);
      return response(res, 200, "Question deleted successfully", {});
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  // Update a question by ID
  static async updateSingleQuestion(req, res) {
    const { id } = req.params;
    const { question, options } = req.body;

    try {
      const existingQuestion = await TrafficQuestionService.getQuestionById(id);
      if (!existingQuestion) {
        return response(res, 404, "Question not found", null, "NOT_FOUND");
      }

      const dataToEdit = {
        question: {
          description:
            question.description || existingQuestion.question.description,
          imageURLs: question.imageURLs || existingQuestion.question.imageURLs,
        },
        options: options.length ? options : existingQuestion.options,
        isTrial: question.hasOwnProperty("isTrial")
          ? question.isTrial
          : existingQuestion.isTrial,
        language: question.language || existingQuestion.language,
      };

      const updatedQuestion = await TrafficQuestionService.updateQuestion(
        id,
        dataToEdit
      );
      return response(
        res,
        200,
        "Question updated successfully",
        updatedQuestion
      );
    } catch (error) {
      console.error("Error updating question:", error);
      return response(
        res,
        500,
        error.message || "An error occurred while updating the question.",
        null,
        "SERVER_ERROR"
      );
    }
  }
}

export default TrafficQuestionsController;
