import User from "../models/user.js";
import Payment from "../models/payment.js";

class UserServices {
  static async getUserRegistrationStats() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const todayRegs = await User.countDocuments({ createdAt: { $gte: startOfDay } });
    const monthRegs = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    const yearRegs = await User.countDocuments({ createdAt: { $gte: startOfYear } });

    return {
      today: todayRegs,
      month: monthRegs,
      year: yearRegs,
    };
  }
  static async getSingleUser(query) {
    const user= await User
    .findOne(query)
    .exec();


    
   
    return user;
  }
  static async userSignup(userData) {
    const user = await User.create(userData);
    return user;
  }

  static async grantAndRevokePermission(id, permissions) {
    const updatedUser = await User.updateOne(
      { _id: id },
      { permissions}
    );
    return updatedUser;
  }

  static async updateUserRole(id,role){
    const updatedUserWithRole = await User.updateOne({_id:id},{role});
    return updatedUserWithRole;
  }

  static async deleteExistingUser(id){
    const deletedUser = await User.deleteOne({_id:id});
    return deletedUser;
  }

  static async updateUserDetails(id,info){
    const updatedUser = await User.updateOne({_id:id},{...info});
    return updatedUser;
  }

  static async getUsers(page = 1, limit = 10, search = '') {
    try {
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Build search filter - use text search if search provided
      const searchFilter = search
        ? { $text: { $search: search } }
        : {};

      // Get total count for pagination metadata
      const total = await User.countDocuments(searchFilter);
      const totalPages = Math.ceil(total / limit);

      // Fetch users with optimized query:
      // - Text index search (much faster than regex)
      // - Only necessary fields
      // - Pagination
      // - Sorting by latest first
      const users = await User.find(searchFilter)
        .select('-password -__v') // Exclude sensitive fields
        .sort({ createdAt: -1 }) // Latest first
        .skip(skip)
        .limit(limit)
        .lean() // Return plain objects (faster)
        .maxTimeMS(10000) // 10 second timeout
        .exec();

      return {
        users,
        page,
        limit,
        total,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }
  static async getUserById(userId){
    const user = await User.findById(userId);
    return user;
  }

  static async getUserAndPayment(userId){
    const user = await User.findById(userId);
    const payment = await Payment.find({user:userId});
    return {user,payment};
  }

}
export default UserServices;
