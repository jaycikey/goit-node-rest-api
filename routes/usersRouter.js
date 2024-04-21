import express from "express";
import {
  register,
  login,
  logout,
  currentUser,
  updateSubscription,
} from "../controllers/usersControllers.js";
import authenticate from "../middleware/authenticate.js";
import validateBody from "../helpers/validateBody.js";
import {
  userRegisterSchema,
  updateSubscriptionSchema,
} from "../schemas/userSchemas.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(userRegisterSchema), register);
usersRouter.post("/login", validateBody(userRegisterSchema), login);
usersRouter.post("/logout", authenticate, logout);
usersRouter.get("/current", authenticate, currentUser);
usersRouter.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

export default usersRouter;
