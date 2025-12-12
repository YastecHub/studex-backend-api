/**
 * Auth DTOs (Data Transfer Objects)
 * Used for request/response data validation and type safety
 */

/**
 * Sign up request DTO
 */
export interface SignupRequestDto {
  matric: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  schoolName: string;
  skillCategory: string;
  interests?: string[];
  profileImageUrl?: string;
}

/**
 * Skill categories enum
 */
export enum SkillCategory {
  CLIENT = 'Client',
  FREELANCER = 'Freelancer',
  HYBRID = 'Hybrid',
}

/**
 * Login request DTO
 */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/**
 * User response DTO
 */
export interface UserDto {
  id: string;
  matric: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  schoolName: string;
  skillCategory: string;
  interests: string[];
  profileImage: string | null;
}

/**
 * Auth response DTO (includes token)
 */
export interface AuthResponseDto {
  token: string;
  user: UserDto;
}
