export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  statusCode?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    matric: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    schoolName: string;
    skillCategory: string;
    profileImage: string | null;
  };
}

export interface UserResponse {
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

// Helper function to create success response
export const successResponse = <T>(
  message: string,
  data?: T,
  statusCode: number = 200
): BaseResponse<T> => {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
};

// Helper function to create error response
export const errorResponse = (
  message: string,
  errors?: Record<string, string>,
  statusCode: number = 500
): BaseResponse => {
  return {
    success: false,
    message,
    errors,
    statusCode,
  };
};
