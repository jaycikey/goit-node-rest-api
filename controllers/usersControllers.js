import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
} from "../services/userServices.js";
import User from "../models/User.js";
import fs from "fs/promises";
import path from "path";
import jimp from "jimp";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.user);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    const userData = await getCurrentUser(req.user);
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const user = await updateUserSubscription(
      req.user._id,
      req.body.subscription
    );
    res.json({ subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};

export const patchAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Process the image with Jimp
    const image = await jimp.read(req.file.path);
    await image.resize(250, 250).quality(60).writeAsync(req.file.path);

    // Define new path for the processed image
    const newPath = path.join("public", "avatars", req.file.filename); // Use path.join to create the file path

    // Move file from tmp to public/avatars
    await fs.rename(req.file.path, newPath);

    // Update user's avatar URL in the database
    const avatarURL = path.join("/avatars", req.file.filename); // Use path.join to create the URL path
    await User.findByIdAndUpdate(req.user._id, { avatarURL });

    // Send back the new avatar URL
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(req.file.path); // Cleanup if something goes wrong
    next(error);
  }
};
