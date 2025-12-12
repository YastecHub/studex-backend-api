import { Response } from 'express';
import { jobService } from '../services/jobService';
import { AuthRequest } from '../middleware/auth';
import { successResponse } from '../utils/response';

export const createJob = async (req: AuthRequest, res: Response) => {
  const result = await jobService.createJob(req.user!.id, req.body);
  return res.status(201).json(successResponse('Job posted successfully', result, 201));
};

export const getJobs = async (req: AuthRequest, res: Response) => {
  const result = await jobService.getJobs(req.query);
  return res.status(200).json(successResponse('Jobs retrieved successfully', result));
};

export const getUserJobs = async (req: AuthRequest, res: Response) => {
  const result = await jobService.getUserJobs(req.user!.id);
  return res.status(200).json(successResponse('User jobs retrieved successfully', result));
};