import { Response } from 'express';
import { serviceService } from '../services/serviceService';
import { AuthRequest } from '../middleware/auth';
import { successResponse } from '../utils/response';

export const createService = async (req: AuthRequest, res: Response) => {
  const result = await serviceService.createService(req.user!.id, req.body, req.files as Express.Multer.File[]);
  return res.status(201).json(successResponse('Service created successfully', result, 201));
};

export const getServices = async (req: AuthRequest, res: Response) => {
  const result = await serviceService.getServices(req.query);
  return res.status(200).json(successResponse('Services retrieved successfully', result));
};

export const getServiceById = async (req: AuthRequest, res: Response) => {
  const result = await serviceService.getServiceById(req.params.id);
  return res.status(200).json(successResponse('Service retrieved successfully', result));
};

export const getUserServices = async (req: AuthRequest, res: Response) => {
  const result = await serviceService.getUserServices(req.user!.id);
  return res.status(200).json(successResponse('User services retrieved successfully', result));
};