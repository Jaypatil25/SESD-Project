import { ValidationError } from './errors';

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

export function validatePassword(password: string): void {
  if (password.length < 6) {
    throw new ValidationError(
      'Password must be at least 6 characters long',
      'password'
    );
  }
}

export function validateNonEmptyString(
  value: string,
  fieldName: string
): void {
  if (!value || value.trim().length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
  }
}

export function validatePositiveNumber(
  value: number,
  fieldName: string
): void {
  if (value <= 0) {
    throw new ValidationError(`${fieldName} must be a positive number`, fieldName);
  }
}

export function hashPassword(password: string): string {
  
  return Buffer.from(password).toString('base64');
}

export function verifyPassword(password: string, hash: string): boolean {
  
  return hashPassword(password) === hash;
}
