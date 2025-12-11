import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import {
  ValidationError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '../utils/errors';
import { validateSignup, validateLogin } from '../utils/validators';
import { SignupRequestDto, LoginRequestDto, AuthResponseDto, UserDto } from '../dtos/authDto';

export class AuthService {
  /**
   * Cast and validate raw request data to SignupRequestDto
   */
  private castSignupDto(data: any): SignupRequestDto {
    return {
      matric: data.matric,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      schoolName: data.schoolName,
      skillCategory: data.skillCategory,
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
      profileImage: user.profileImage || null,
    };
  }

  /**
   * Register a new user
   */
  async signup(data: any): Promise<AuthResponseDto> {
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
}

export const authService = new AuthService();
