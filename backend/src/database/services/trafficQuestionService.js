import TrafficQuestion from "../models/trafficQuestions.js";

class TrafficQuestionService {
  // Add a new question to the database
  static async addNewQuestion(questionData) {
    try {
      const question = await TrafficQuestion.create(questionData);
      return question;
    } catch (error) {
      console.error("Error saving question to the database:", error);
      throw new Error("Database insertion failed");
    }
  }

  // Fetch up to 20 questions based on the provided filter
  static async getQuestions(filter, isPaidUser) {
    try {
      // Step 1: Apply filter and ensure no trial questions for paid users
      if (isPaidUser) {
        filter.isTrial = false; 
        
      }

     // Step 2: Fetch 4 questions with images
      let questionsWithImages = await TrafficQuestion.aggregate([
        {
          $match: {
            ...filter,
            $or: [
              { "question.imageURLs": { $exists: true, $ne: [] } },
              { "options.optionImageURL": { $exists: true, $ne: null } },
            ],
          },
        },
        { $sample: { size: 4 } } 
      ]);
  

      // Step 3: Calculate remaining count of questions needed
      const remainingCount = 20 - questionsWithImages.length;


     // Step 4: Fetch remaining questions without images
      let remainingQuestions = await TrafficQuestion.aggregate([
        {
          $match: {
            ...filter,
            _id: { $nin: questionsWithImages.map(q => q._id) }, 
            $nor: [
              { "question.imageURLs": { $exists: true, $ne: [] } },
              { "options.optionImageURL": { $exists: true, $ne: null } }
            ],
          },
        },
        { $sample: { size: remainingCount } } 
      ]);
     
      // Step 5: Combine questions with and without images
      let allQuestions = [...questionsWithImages, ...remainingQuestions];
      const uniqueQuestionsMap = new Map();
      allQuestions.forEach(question => {
        uniqueQuestionsMap.set(question._id.toString(), question);
      });
   

      let uniqueQuestions = Array.from(uniqueQuestionsMap.values());

      // Step 6: Ensure exactly 20 questions are returned
      while (uniqueQuestions.length < 20) {
        const neededCount = 20 - uniqueQuestions.length;

      // Fetch additional questions without images
        const additionalQuestions = await TrafficQuestion.aggregate([
          {
            $match: {
              ...filter,
              _id: { $nin: uniqueQuestions.map(q => q._id) },
              $nor: [
                { "question.imageURLs": { $exists: true, $ne: [] } },
                { "options.optionImageURL": { $exists: true, $ne: null } }
              ],
            },
          },
          { $sample: { size: neededCount } }
        ]);

       // Combine additional questions with existing questions
        additionalQuestions.forEach(question => {
          if (!uniqueQuestionsMap.has(question._id.toString())) {
            uniqueQuestionsMap.set(question._id.toString(), question);
          }
        });

        uniqueQuestions = Array.from(uniqueQuestionsMap.values());
      }

      
      // Step 7: Shuffle the questions and return 20 random questions with algorithm of Fisher-Yates
      for (let i = uniqueQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueQuestions[i], uniqueQuestions[j]] = [uniqueQuestions[j], uniqueQuestions[i]];
      }
   
      return uniqueQuestions.slice(0, 20);

    } catch (error) {
      console.error("Error fetching questions:", error);
      throw new Error("Error fetching questions");
    }
  }

 // Fetch up to 20 trial questions based on the provided filter
  static async getTrialQuestions(filter) {
    try {
      const questions = await TrafficQuestion.find({ isTrial: true, ...filter }).limit(20);
      return questions;
    } catch (error) {
      console.error("Error fetching trial questions:", error);
      throw new Error("Error fetching trial questions");
    }
  }


  // Fetch all questions from the database
  static async getAllQuestions() {
    try {
      const questions = await TrafficQuestion.find()
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });
      return questions;
    } catch (error) {
      throw new Error("Error fetching all questions");
    }
  }

  // Fetch a single question by its ID
  static async getQuestionById(id) {
    try {
      const question = await TrafficQuestion.findById(id);
      return question;
    } catch (error) {
      throw new Error("Error fetching question by ID");
    }
  }

  // Delete a question by its ID
  static async deleteQuestion(id) {
    try {
      const deletedQuestion = await TrafficQuestion.deleteOne({ _id: id });
      return deletedQuestion;
    } catch (error) {
      throw new Error("Error deleting question");
    }
  }

  // Update a question by its ID
  static async updateQuestion(id, info) {
    try {
      const updatedQuestion = await TrafficQuestion.updateOne({ _id: id }, { ...info });
      return updatedQuestion;
    } catch (error) {
      throw new Error("Error updating question");
    }
  }

  // Fetch a specified number of questions that include images
  static async getQuestionsWithImages(count) {
    try {
      const questions = await TrafficQuestion.aggregate([
        {
          $match: {
            $or: [
              { "question.imageURLs": { $exists: true, $ne: [] } },
              { "options.optionImageURL": { $exists: true, $ne: null } },
            ],
          },
        },
        { $sample: { size: count } },
      ]);
      return questions;
    } catch (error) {
      throw new Error("Error fetching questions with images");
    }
  }
}

export default TrafficQuestionService;
