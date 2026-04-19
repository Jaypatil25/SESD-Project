import bcryptjs from 'bcryptjs';

/**
 * Password utility helper for hashing and comparing passwords
 */
export class PasswordHelper {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash a plain text password
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcryptjs.genSalt(this.SALT_ROUNDS);
      return await bcryptjs.hash(password, salt);
    } catch (error) {
      throw new Error('Error hashing password');
    }
  }

  /**
   * Compare plain text password with hashed password
   */
  static async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcryptjs.compare(plainPassword, hashedPassword);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate password strength
   * - At least 6 characters
   * - At least 1 uppercase letter
   * - At least 1 number
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate a random temporary password
   */
  static generateTemporaryPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const all = uppercase + lowercase + numbers;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    for (let i = 0; i < 6; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}
