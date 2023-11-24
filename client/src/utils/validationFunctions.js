/* eslint-disable prettier/prettier */

/* File not in use in the project*/

// Validation for name
export const nameValidationFunction = (name) => {
  const errors = {};
  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }
  return errors;
};

// Validation for username
export const usernameValidationFunction = (username) => {
  const errors = {};
  if (!username) {
    errors.username = 'Username is required';
  } else if (username.length < 5) {
    errors.username = 'Username must be at least 5 characters';
  }
  return errors;
};

// Validation for email
export const emailValidationFunction = (email) => {
  const errors = {};
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Invalid email format';
  }
  return errors;
};

// Validation for phone number
export const phoneNumberValidationFunction = (phoneNumber) => {
  const errors = {};
  const phoneNumberRegex = /^\d+$/;
  if (!phoneNumber) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!phoneNumberRegex.test(phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format';
  }
  return errors;
};

// Validation for password
export const passwordValidationFunction = (password) => {
  const errors = {};
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  return errors;
};

// Validation for confirmPassword
export const confirmPasswordValidationFunction = (confirmPassword, password) => {
  const errors = {};
  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};
