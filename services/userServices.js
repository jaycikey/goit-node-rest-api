import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

export async function registerUser({ email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  return {
    email: newUser.email,
    subscription: newUser.subscription,
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(401, "Email or password is wrong");
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  user.token = token;
  await user.save();
  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
}

export async function logoutUser(user) {
  user.token = null;
  await user.save();
}

export async function getCurrentUser(user) {
  return {
    email: user.email,
    subscription: user.subscription,
  };
}

export async function updateUserSubscription(userId, subscription) {
  const user = await User.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true }
  );
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return user;
}
