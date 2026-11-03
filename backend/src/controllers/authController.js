import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists.', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = signToken({ id: user._id, role: user.role });

    return successResponse(
      res,
      {
        user,
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password credentials.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password credentials.', 401);
    }

    const token = signToken({ id: user._id, role: user.role });

    // Exclude password
    const safeUser = user.toJSON();

    return successResponse(
      res,
      {
        user: safeUser,
        token,
      },
      'Logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return successResponse(res, { user: req.user }, 'Current user profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, preferences, apiKeys } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (apiKeys) user.apiKeys = { ...user.apiKeys, ...apiKeys };

    await user.save();

    return successResponse(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

