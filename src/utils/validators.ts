export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): ValidationError | null => {
  if (!password || password.length < 6) {
    return {
      field: 'password',
      message: 'Password must be at least 6 characters',
    };
  }
  return null;
};

export const validateMatric = (matric: string): boolean => {
  return Boolean(matric && matric.trim().length > 0);
};

export const validateUsername = (username: string): ValidationError | null => {
  if (!username || username.trim().length < 3) {
    return {
      field: 'username',
      message: 'Username must be at least 3 characters',
    };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      field: 'username',
      message: 'Username can only contain letters, numbers, underscore and hyphen',
    };
  }
  return null;
};

export const validateFirstName = (firstName: string): ValidationError | null => {
  if (!firstName || firstName.trim().length === 0) {
    return {
      field: 'firstName',
      message: 'First name is required',
    };
  }
  if (firstName.length < 2) {
    return {
      field: 'firstName',
      message: 'First name must be at least 2 characters',
    };
  }
  return null;
};

export const validateLastName = (lastName: string): ValidationError | null => {
  if (!lastName || lastName.trim().length === 0) {
    return {
      field: 'lastName',
      message: 'Last name is required',
    };
  }
  if (lastName.length < 2) {
    return {
      field: 'lastName',
      message: 'Last name must be at least 2 characters',
    };
  }
  return null;
};

export const validateSchoolName = (schoolName: string): ValidationError | null => {
  if (!schoolName || schoolName.trim().length === 0) {
    return {
      field: 'schoolName',
      message: 'School name is required',
    };
  }
  return null;
};

export const validateSkillCategory = (skillCategory: string): ValidationError | null => {
  if (!skillCategory || skillCategory.trim().length === 0) {
    return {
      field: 'skillCategory',
      message: 'Skill/category is required',
    };
  }
  return null;
};

export const validateSignup = (data: {
  matric?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  schoolName?: string;
  skillCategory?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.matric) {
    errors.push({
      field: 'matric',
      message: 'Matric number is required',
    });
  } else if (!validateMatric(data.matric)) {
    errors.push({
      field: 'matric',
      message: 'Invalid matric number',
    });
  }

  if (!data.email) {
    errors.push({
      field: 'email',
      message: 'Email is required',
    });
  } else if (!validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format',
    });
  }

  const passwordError = validatePassword(data.password || '');
  if (passwordError) {
    errors.push(passwordError);
  }

  const firstNameError = validateFirstName(data.firstName || '');
  if (firstNameError) {
    errors.push(firstNameError);
  }

  const lastNameError = validateLastName(data.lastName || '');
  if (lastNameError) {
    errors.push(lastNameError);
  }

  const usernameError = validateUsername(data.username || '');
  if (usernameError) {
    errors.push(usernameError);
  }

  const schoolNameError = validateSchoolName(data.schoolName || '');
  if (schoolNameError) {
    errors.push(schoolNameError);
  }

  const skillCategoryError = validateSkillCategory(data.skillCategory || '');
  if (skillCategoryError) {
    errors.push(skillCategoryError);
  }

  return errors;
};

export const validateLogin = (data: {
  email?: string;
  password?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.email) {
    errors.push({
      field: 'email',
      message: 'Email is required',
    });
  } else if (!validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format',
    });
  }

  if (!data.password) {
    errors.push({
      field: 'password',
      message: 'Password is required',
    });
  }

  return errors;
};
