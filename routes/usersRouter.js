import express from "express";
import authenticate from "../middleware/authenticate.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validateBody from "../helpers/validateBody.js";
import {
  userRegisterSchema,
  updateSubscriptionSchema,
} from "../schemas/userSchemas.js";

const usersRouter = express.Router();

// User registration endpoint
usersRouter.post("/register", async (req, res) => {
  try {
    // Validate request body
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      subscription: "starter",
    });
    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User login endpoint
usersRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    const { error } = userRegisterSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout endpoint
usersRouter.post("/logout", authenticate, async (req, res) => {
  try {
    const user = req.user;
    user.token = null; // Remove the token
    await user.save();
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Current user endpoint
usersRouter.get("/current", authenticate, async (req, res) => {
  try {
    // Since authenticate middleware has already added the user to req.user
    const { email, subscription } = req.user;
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user subscription endpoint
usersRouter.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  async (req, res) => {
    try {
      const { subscription } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { subscription },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ subscription: user.subscription });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default usersRouter;
