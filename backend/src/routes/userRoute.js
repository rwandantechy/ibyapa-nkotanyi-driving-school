import express from "express";
import userController from "../controllers/userController.js";
import * as Validation from "../middlewares/validation/user.js";
import IsAllowed from "../middlewares/verify.js";

const userRoute = express.Router();

userRoute.post("/signup", Validation.userSignupValidation, userController.signUp);
userRoute.post("/login", Validation.userLoginValidation, userController.login);
userRoute.post("/logout", IsAllowed.verifyToken, userController.logout);
userRoute.post("/grant-or-revoke-permissions/:id",IsAllowed.verifyAdmin, userController.changePermissions);
userRoute.patch("/change-user-role/:id", IsAllowed.verifyAdmin,userController.changerUserRole);
userRoute.delete("/delete-user/:id",IsAllowed.verifyAdmin,userController.deleteUser);
userRoute.get("/get-all-users",IsAllowed.verifyAdmin,userController.getAllUsers);
userRoute.get("/registration-stats", IsAllowed.verifyAdmin, userController.getUserRegistrationStats);
userRoute.put("/change-role/:id", IsAllowed.verifyAdmin, userController.changerUserRole);
userRoute.patch("/update-user/:id", IsAllowed.verifyToken, userController.updateUser);
userRoute.get("/get-user-and-payment/:id", IsAllowed.verifyToken, userController.getSingleUserWithPayment);
userRoute.get("/get-user/:phone", IsAllowed.verifyToken, userController.findUserByPhone);
userRoute.post("/reset-password-by-admin/:userId", IsAllowed.verifyToken, userController.setNewPasswordByAdmin);
export default userRoute;
