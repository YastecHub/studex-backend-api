import { Router, type Router as ExpressRouter } from 'express';
import { signup, login, getProfile, updateProfile, updateProfileImage, getUsers, searchUsers } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateLogin, validateSignup } from '../utils/validators';
import { uploadMiddleware } from '../utils/cloudinary';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user with profile information and optional image
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               matric:
 *                 type: string
 *                 description: Student matric number
 *                 example: "STU001"
 *               email:
 *                 type: string
 *                 description: User email address
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: User password (min 6 characters)
 *                 example: "password123"
 *               firstName:
 *                 type: string
 *                 description: User first name
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: User last name
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 description: Unique username for user profile
 *                 example: "johndoe"
 *               schoolName:
 *                 type: string
 *                 description: Name of the user's school/institution
 *                 example: "University of Lagos"
 *               skillCategory:
 *                 type: string
 *                 description: Primary skill or category (Client, Freelancer, Hybrid)
 *                 enum:
 *                   - Client
 *                   - Freelancer
 *                   - Hybrid
 *                 example: "Freelancer"
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user interests/hobbies selected from the frontend
 *                 example: ["Photography", "Design", "Technology"]
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (optional, non-breaking if upload fails)
 *             required:
 *               - matric
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - username
 *               - schoolName
 *               - skillCategory
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token for authentication
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         matric:
 *                           type: string
 *                         email:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         username:
 *                           type: string
 *                         schoolName:
 *                           type: string
 *                         skillCategory:
 *                           type: string
 *                         interests:
 *                           type: array
 *                           items:
 *                             type: string
 *                         profileImage:
 *                           type: string
 *                           nullable: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: object
 *       409:
 *         description: User already exists (email, matric, or username conflict)
 */
router.post('/signup', uploadMiddleware.single('profileImage'), asyncHandler(signup));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: "password123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token for authentication
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         matric:
 *                           type: string
 *                         email:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         username:
 *                           type: string
 *                         schoolName:
 *                           type: string
 *                         skillCategory:
 *                           type: string
 *                         profileImage:
 *                           type: string
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Validation error
 */
router.post('/login', asyncHandler(login));

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     matric:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     username:
 *                       type: string
 *                     schoolName:
 *                       type: string
 *                     skillCategory:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       404:
 *         description: User not found
 */
router.get('/profile', authMiddleware, asyncHandler(getProfile));

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               schoolName:
 *                 type: string
 *                 example: "University of Lagos"
 *               skillCategory:
 *                 type: string
 *                 enum: [Client, Freelancer, Hybrid]
 *                 example: "Freelancer"
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Photography", "Design"]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authMiddleware, asyncHandler(updateProfile));

/**
 * @swagger
 * /api/auth/profile/image:
 *   put:
 *     summary: Update profile image
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: New profile image
 *             required:
 *               - profileImage
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *       400:
 *         description: Invalid file or validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/profile/image', authMiddleware, uploadMiddleware.single('profileImage'), asyncHandler(updateProfileImage));

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users (for discovery/matching)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: skillCategory
 *         schema:
 *           type: string
 *           enum: [Client, Freelancer, Hybrid]
 *         description: Filter by skill category
 *       - in: query
 *         name: schoolName
 *         schema:
 *           type: string
 *         description: Filter by school name
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/users', authMiddleware, asyncHandler(getUsers));

/**
 * @swagger
 * /api/auth/users/search:
 *   get:
 *     summary: Search users by name, username, or interests
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Missing search query
 *       401:
 *         description: Unauthorized
 */
router.get('/users/search', authMiddleware, asyncHandler(searchUsers));

export default router;
