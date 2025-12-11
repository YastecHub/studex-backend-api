import { Response } from 'express';
import { authService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import { successResponse, AuthResponse, UserResponse, errorResponse } from '../utils/response';
import { ValidationError, AppError } from '../utils/errors';

export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const result = await authService.signup(req.body);

    const response = successResponse<AuthResponse>(
      'User registered successfully',
      result,
      201
    );
    return res.status(201).json(response);
  } catch (error) {
    console.error('[SignupController] Error:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json(errorResponse(error.message, error.errors, 400));
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(errorResponse(error.message, undefined, error.statusCode));
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: (error as any)?.message,
    });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const result = await authService.login(req.body);

    const response = successResponse<AuthResponse>(
      'Login successful',
      result,
      200
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error('[Login Error]', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json(errorResponse(error.message, error.errors, 400));
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(errorResponse(error.message, undefined, error.statusCode));
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: (error as any)?.message,
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
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
  } catch (error) {
    console.error('[GetProfile Error]', error);
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(errorResponse(error.message, undefined, error.statusCode));
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: (error as any)?.message,
    });
  }
};
