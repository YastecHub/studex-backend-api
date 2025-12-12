import { Router, type Router as ExpressRouter } from 'express';
import { signup, login, getProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
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
router.post('/signup', uploadMiddleware.single('profileImage'), signup);

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
router.post('/login', login);

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
router.get('/profile', authMiddleware, getProfile);

export default router;
