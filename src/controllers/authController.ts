import { Response } from 'express';
import { authService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import { successResponse, AuthResponse, UserResponse, errorResponse } from '../utils/response';
import { ValidationError, AppError } from '../utils/errors';

export const signup = async (req: AuthRequest, res: Response) => {
  const result = await authService.signup(req.body, req.file);
  const response = successResponse<AuthResponse>(
    'User registered successfully',
    result,
    201
  );
  return res.status(201).json(response);
};

export const login = async (req: AuthRequest, res: Response) => {
  const result = await authService.login(req.body);
  const response = successResponse<AuthResponse>(
    'Login successful',
    result,
    200
  );
  return res.status(200).json(response);
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const user = await authService.getProfile(req.user.id);
  const response = successResponse<UserResponse>(
    'Profile retrieved successfully',
    user,
    200
  );
  return res.status(200).json(response);
};
