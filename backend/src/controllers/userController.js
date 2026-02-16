import { generate, check } from "../utils/bcrypt.js";
import { sign } from "../utils/jwt.js";
import response from "../utils/response.js";
import User from "../database/models/user.js";
import UserServices from "../database/services/userService.js";
import { randomBytes } from "crypto";

class UserController {
  static async signUp(req, res) {
    try {
      const { phone } = req.body;
      const phoneUserExist = await UserServices.getSingleUser({ phone });
      if (phoneUserExist) {
        return response(res, 409, req.t("phone_exists"), null, "PHONE_EXISTS");
      }

      const newUser = {
        name: req.body.name,
        phone: phone,
        language: req.body.language,
        password: generate(req.body.password),
      };

      const data = await UserServices.userSignup(newUser);

      return response(res, 201, req.t("signup_successful"), data);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async login(req, res) {
    try {
      
      const { account, password } = req.body;
      const user = await UserServices.getSingleUser({ phone: account });
      
      if (!user) {
        return response(
          res,
          404,
          req.t("user_not_found"),
          null,
          "USER_NOT_FOUND"
        );
      }
      if (!check(user.password, password)) {
        return response(
          res,
          401,
          req.t("wrong_password"),
          null,
          "UNAUTHORIZED"
        );
      }

  // Generate new sessionId; this invalidates any previous sessions
      const sessionId = randomBytes(16).toString("hex");
  const hadExistingSession = Boolean(user.sessionId);

      // Mark user as logged in with a fresh session
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { 
          sessionId,
          lastLoginAt: new Date()
        },
        { new: true }
      );

      const accessToken = sign({
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone,
        permissions: updatedUser.permissions,
        lang: updatedUser.language,
        sessionId: updatedUser.sessionId,
      });

      // sanitize and attach token to response payload
  updatedUser.password = undefined;
      updatedUser._doc.accessToken = accessToken;
      // include a session policy notice so client can notify user
      updatedUser._doc.sessionNotice = req.t("single_session_notice");
      updatedUser._doc.otherSessionsTerminated = hadExistingSession;
      if (hadExistingSession) {
        updatedUser._doc.sessionMessage = req.t("other_sessions_terminated");
      }
      return response(res, 200, req.t("login_successful"), updatedUser);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async changePermissions(req, res) {
    const { permissions } = req.body;
    const userId = req.params.id;
    try {
      const user = await UserServices.getUserById(userId);
      let existingPermissions = user.permissions || [];
      existingPermissions = existingPermissions.filter((permission) => {
        return (
          permission.permission_value !== false &&
          (!permission.permission_expiry ||
            new Date(permission.permission_expiry) > new Date())
        );
      });

      permissions.forEach((newPermission) => {
        const { permission_name, permission_value, permission_expiry } =
          newPermission;

        const existingPermissionIndex = existingPermissions.findIndex(
          (p) => p.permission_name === permission_name
        );

        if (existingPermissionIndex !== -1) {
          existingPermissions[existingPermissionIndex].permission_value =
            permission_value;
          existingPermissions[existingPermissionIndex].permission_expiry =
            permission_expiry;
        } else {
          existingPermissions.push({
            permission_name,
            permission_value,
            permission_expiry,
          });
        }
      });

      await UserServices.grantAndRevokePermission(userId, existingPermissions);
      return response(
        res,
        200,
        req.t("permissions_changed"),
        existingPermissions
      );
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async changerUserRole(req, res) {
    const id = req.params.id;
    const { role } = req.body;
    try {
      const updatedUserRole = await UserServices.updateUserRole(id, role);
      return response(res, 200, req.t("role_updated"), updatedUserRole);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await UserServices.getUserById(req.params.id);

      if (!user) {
        return response(
          res,
          404,
          req.t("user_not_found"),
          null,
          "USER_NOT_FOUND"
        );
      }

      if (user.id === req.user.id) {
        return response(
          res,
          403,
          req.t("cannot_delete_own_account"),
          null,
          "FORBIDDEN"
        );
      }
      await UserServices.deleteExistingUser(user.id);
      return response(res, 200, req.t("user_deleted"), {});
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  }

  static async getAllUsers(req, res) {
    try {
      const users = await UserServices.getUsers();
      return response(res, 200, req.t("users_retrieved"), users);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async updateUser(req, res) {
    const userId = req.params.id;
    const { phone, name, lang } = req.body;
    const { id } = req.user;

    const dataToEdit = { phone, name, language: lang };
    try {
      const user = await UserServices.getUserById(userId);
      if (!user) {
        return response(
          res,
          404,
          req.t("user_not_found"),
          null,
          "USER_NOT_FOUND"
        );
      }
      if (id !== userId) {
        return response(
          res,
          403,
          req.t("not_allowed_to_update_user"),
          null,
          "FORBIDDEN"
        );
      }
      const updatedUser = await UserServices.updateUserDetails(id, dataToEdit);
      return response(res, 200, req.t("user_updated"), updatedUser);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async getSingleUserWithPayment(req, res) {
    const userId = req.params.id;
    try {
      const userAndPayment = await UserServices.getUserAndPayment(userId);
      return response(
        res,
        200,
        req.t("user_payment_retrieved"),
        userAndPayment
      );
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async findUserByPhone(req, res) {
    try {
      const { phone } = req.params;
      let admin = req.user.role;
      if (admin !== "admin") {
        return response(
          res,
          403,
          "You are not authorized to perform this operation",
          null,
          "FORBIDDEN"
        );
      }

      // Step 1: Admin searches for the user using the phone number
      const user = await User.findOne({ phone });

      // Step 2: If the user is not found, return an error response
      if (!user) {
        return response(res, 404, "User not found", null, "NOT_FOUND");
      }

      // Step 3: Return user data to the admin for confirmation
      return response(res, 200, "User found", {
        id: user._id,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error("Error finding user:", error.message || error);
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async setNewPasswordByAdmin(req, res) {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return response(res, 404, "User not found", null, "NOT_FOUND");
      }

      if (!newPassword) {
        return response(
          res,
          400,
          "New password is required",
          null,
          "BAD_REQUEST"
        );
      }

      // Hash the new password (assuming generate is a hashing function like bcrypt)
      const hashedPassword = generate(newPassword);

      user.password = hashedPassword;
      await user.save();

      return response(res, 200, "Password reset successfully", {
        id: user._id,
        name: user.name,
        phone: user.phone,
      });
    } catch (error) {
      console.error("Error resetting password:", error.message || error);
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async getUserRegistrationStats(req, res) {
    try {
      const stats = await UserServices.getUserRegistrationStats();
      return response(res, 200, "User registration stats retrieved", stats);
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }

  static async logout(req, res) {
    try {
      const userId = req.user.id;

      // Clear the login session
      await User.findByIdAndUpdate(userId, {
        sessionId: null,
      });

      return response(res, 200, req.t("logout_successful"), {});
    } catch (error) {
      return response(res, 500, error.message || error, null, "SERVER_ERROR");
    }
  }
}
export default UserController;
