import { Router, type Router as ExpressRouter } from 'express';
import { createService, getServices, getServiceById, getUserServices } from '../controllers/serviceController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { uploadMiddleware } from '../utils/cloudinary';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service (Freelancers only)
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               price:
 *                 type: number
 *               priceType:
 *                 type: string
 *                 enum: [FIXED, NEGOTIABLE]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               portfolioImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post('/', authMiddleware, uploadMiddleware.array('portfolioImages', 5), asyncHandler(createService));

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services with filters
 *     tags: [Services]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 */
router.get('/', authMiddleware, asyncHandler(getServices));

/**
 * @swagger
 * /api/services/my-services:
 *   get:
 *     summary: Get current user's services
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User services retrieved successfully
 */
router.get('/my-services', authMiddleware, asyncHandler(getUserServices));

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 */
router.get('/:id', authMiddleware, asyncHandler(getServiceById));

export default router;