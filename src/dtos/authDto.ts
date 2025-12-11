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
  profileImage: string | null;
}

/**
 * Auth response DTO (includes token)
 */
export interface AuthResponseDto {
  token: string;
  user: UserDto;
}
