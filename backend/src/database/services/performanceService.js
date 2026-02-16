import Performance from "../models/performance.js";

class PerformanceService {
  static async createPerformance(userId, examData) {
    const newPerformance = new Performance({ userId, ...examData });
    return await newPerformance.save();
  }

  static async getUserPerformances(userId) {
    return await Performance.find({ userId }).sort({ dateTaken: -1 });
  }
}

export default PerformanceService;