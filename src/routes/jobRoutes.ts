import { Router } from 'express';
import { createJob, getJobs, getUserJobs } from '../controllers/jobController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Post a new job (Clients only)
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Design, Development, Photography, Tutoring, Writing, Beauty, Laundry, Video]
 *               budget:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Job posted successfully
 */
router.post('/', authMiddleware, asyncHandler(createJob));

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all open jobs
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 */
router.get('/', authMiddleware, asyncHandler(getJobs));

/**
 * @swagger
 * /api/jobs/my-jobs:
 *   get:
 *     summary: Get current user's posted jobs
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User jobs retrieved successfully
 */
router.get('/my-jobs', authMiddleware, asyncHandler(getUserJobs));

export default router;