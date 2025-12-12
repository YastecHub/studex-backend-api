import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import {
  ValidationError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  AppError,
} from '../utils/errors';
import { validateSignup, validateLogin } from '../utils/validators';
import { SignupRequestDto, LoginRequestDto, AuthResponseDto, UserDto } from '../dtos/authDto';
import { uploadToCloudinary } from '../utils/cloudinary';

export class AuthService {
  /**
   * Cast and validate raw request data to SignupRequestDto
   */
  private castSignupDto(data: any): SignupRequestDto {
    // Handle interests - can come as JSON string, array, or comma-separated string
    let interests: string[] = [];
    
    if (data.interests) {
      if (typeof data.interests === 'string') {
        // If it's a JSON string, parse it
        if (data.interests.startsWith('[')) {
          try {
            interests = JSON.parse(data.interests);
          } catch {
            // If not valid JSON, split by comma
            interests = data.interests.split(',').map((i: string) => i.trim()).filter((i: string) => i);
          }
        } else {
          // Split by comma for comma-separated values
          interests = data.interests.split(',').map((i: string) => i.trim()).filter((i: string) => i);
        }
      } else if (Array.isArray(data.interests)) {
        interests = data.interests;
      }
    }

    return {
      matric: data.matric,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      schoolName: data.schoolName,
      skillCategory: data.skillCategory,
      interests,
    };
  }

  /**
   * Cast and validate raw request data to LoginRequestDto
   */
  private castLoginDto(data: any): LoginRequestDto {
    return {
      email: data.email,
      password: data.password,
    };
  }

  /**
   * Format user data to UserDto
   */
  private formatUserDto(user: any): UserDto {
    return {
      id: user._id.toString(),
      matric: user.matric,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      schoolName: user.schoolName,
      skillCategory: user.skillCategory,
      interests: user.interests || [],
      profileImage: user.profileImage || null,
    };
  }

  /**
   * Register a new user
   */
  async signup(data: any, profileImageFile?: Express.Multer.File): Promise<AuthResponseDto> {
    try {
      // Cast raw data to DTO
      const signupData = this.castSignupDto(data);

      // Validate input
      const errors = validateSignup(signupData);
      
      if (errors.length > 0) {
        const errorMap: Record<string, string> = {};
        errors.forEach((err) => {
          errorMap[err.field] = err.message;
        });
        throw new ValidationError('Validation failed', errorMap);
      }

      // Check if user already exists by email
      const existingEmail = await User.findOne({ email: signupData.email });
      if (existingEmail) {
        throw new ConflictError('User with this email already exists');
      }

      // Check if matric already exists
      const existingMatric = await User.findOne({ matric: signupData.matric });
      if (existingMatric) {
        throw new ConflictError('User with this matric number already exists');
      }

      // Check if username already exists
      const existingUsername = await User.findOne({ username: signupData.username });
      if (existingUsername) {
        throw new ConflictError('This username is already taken');
      }

      // Upload profile image if provided (non-breaking if fails)
      let profileImageUrl: string | null = null;
      if (profileImageFile) {
        profileImageUrl = await uploadToCloudinary(profileImageFile);
        // Don't throw if upload fails - registration should still succeed
        if (!profileImageUrl) {
          console.warn('[AuthService.signup] Profile image upload failed but continuing with registration');
        }
      }

      // Create new user
      const user = new User({
        matric: signupData.matric,
        email: signupData.email,
        password: signupData.password,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        username: signupData.username,
        schoolName: signupData.schoolName,
        skillCategory: signupData.skillCategory,
        interests: signupData.interests || [],
        profileImage: profileImageUrl,
      });

      await user.save();

      // Generate token
      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
      });

      return {
        token,
        user: this.formatUserDto(user),
      };
    } catch (error) {
      console.error('[AuthService.signup] Error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(data: any): Promise<AuthResponseDto> {
    // Cast raw data to DTO
    const loginData = this.castLoginDto(data);

    // Validate input
    const errors = validateLogin(loginData);
    if (errors.length > 0) {
      const errorMap: Record<string, string> = {};
      errors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      throw new ValidationError('Validation failed', errorMap);
    }

    // Find user and select password field
    const user = await User.findOne({ email: loginData.email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check password
    const isMatch = await user.matchPassword(loginData.password);

    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    return {
      token,
      user: this.formatUserDto(user),
    };
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<UserDto> {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.formatUserDto(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateData: any): Promise<UserDto> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Validate updateable fields
    const allowedFields = ['firstName', 'lastName', 'username', 'schoolName', 'skillCategory', 'interests'];
    const updates: any = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    }

    // Handle interests array
    if (updateData.interests) {
      if (typeof updateData.interests === 'string') {
        try {
          updates.interests = JSON.parse(updateData.interests);
        } catch {
          updates.interests = updateData.interests.split(',').map((i: string) => i.trim());
        }
      } else if (Array.isArray(updateData.interests)) {
        updates.interests = updateData.interests;
      }
    }

    // Check username uniqueness if being updated
    if (updates.username && updates.username !== user.username) {
      const existingUser = await User.findOne({ username: updates.username });
      if (existingUser) {
        throw new ConflictError('Username is already taken');
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return this.formatUserDto(updatedUser);
  }

  /**
   * Update user profile image
   */
  async updateProfileImage(userId: string, imageFile: Express.Multer.File): Promise<UserDto> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const imageUrl = await uploadToCloudinary(imageFile);
    if (!imageUrl) {
      throw new AppError(500, 'Failed to upload image');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return this.formatUserDto(updatedUser);
  }

  /**
   * Get users with pagination and filtering
   */
  async getUsers(query: any, currentUserId: string) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (query.skillCategory) {
      filter.skillCategory = query.skillCategory;
    }
    
    if (query.schoolName) {
      filter.schoolName = { $regex: query.schoolName, $options: 'i' };
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter)
    ]);

    const formattedUsers = users.map(user => this.formatUserDto(user));

    return {
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Search users by name, username, or interests
   */
  async searchUsers(query: any, currentUserId: string) {
    const searchQuery = query.q;
    if (!searchQuery) {
      throw new ValidationError('Search query is required');
    }

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build search filter
    const searchFilter = {
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } },
        { schoolName: { $regex: searchQuery, $options: 'i' } },
        { interests: { $in: [new RegExp(searchQuery, 'i')] } }
      ]
    };

    const [users, total] = await Promise.all([
      User.find(searchFilter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(searchFilter)
    ]);

    const formattedUsers = users.map(user => this.formatUserDto(user));

    return {
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      query: searchQuery
    };
  }
}

export const authService = new AuthService();
