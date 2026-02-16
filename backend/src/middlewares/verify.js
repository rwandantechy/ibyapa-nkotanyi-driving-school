import response from "../utils/response.js";
import { verify } from "../utils/jwt.js";
import UserServices from "../database/services/userService.js";

class IsAllowed {
  static async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.token;
    
      if (!authHeader) {
        return response(
          res,
          401,
          req.t("not_authenticated"), 
          null,
          req.t("unauthorized")
        );
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return response(
          res,
          401,
          req.t("not_authenticated"),
          null,
          req.t("unauthorized")
        );
      }
      const verified = verify(token);

      // Fetch fresh user to validate session
      const user = await UserServices.getUserById(verified.id);
      if (!user) {
        return response(
          res,
          401,
          req.t("user_not_found"),
          null,
          req.t("unauthorized")
        );
      }

      // Enforce single active session: sessionId in token must match DB
      if (!user.sessionId || user.sessionId !== verified.sessionId) {
        return response(
          res,
          401,
          req.t("session_revoked"),
          null,
          "SESSION_REVOKED"
        );
      }

      req.user = verified;
      req.user.permissions = user.permissions;

      next();
    } catch (error) {
      return response(res, 403, error.message, null, req.t("unauthorized"));
    }
  }

  static verifyAdmin(req, res, next) {
    IsAllowed.verifyToken(req, res, () => {
      if (req.user.role.includes("admin")) {
        return next();
      } else {
        return response(
          res,
          401,
          req.t("not_authorized"),
          null,
          req.t("unauthorized")
        );
      }
    });
  }

  static checkPermission(req, res, next, permission) {
    IsAllowed.verifyToken(req, res, () => {
      if (req.user.role === "admin") {
        return next();
      }
      if (!req.user.role.includes("admin")) {
        const existingPermission = req.user.permissions.find(
          (p) => p.permission_name === permission
        );
        if (!existingPermission || !existingPermission.permission_value) {
          return response(
            res,
            401,
            req.t("not_authorized"),
            null,
            req.t("unauthorized")
          );
        }
        if (
          existingPermission.permission_expiry &&
          new Date(existingPermission.permission_expiry) < new Date()
        ) {
          return response(
            res,
            401,
            req.t("permission_expired"),
            null,
            req.t("unauthorized")
          );
        }
        return next();
      } else {
        return response(
          res,
          401,
          req.t("not_authorized"),
          null,
          req.t("unauthorized")
        );
      }
    });
  }
}

export default IsAllowed;
