import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
} from "../services/userServices.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);
    res.json({ token, user });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await logoutUser(req.user);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const currentUser = async (req, res) => {
  try {
    const userData = await getCurrentUser(req.user);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const user = await updateUserSubscription(
      req.user._id,
      req.body.subscription
    );
    res.json({ subscription: user.subscription });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
