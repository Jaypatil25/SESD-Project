import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: number;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  type: 'student' | 'admin';
}

/**
 * JWT Token utility helper for generating and verifying tokens
 */
export class TokenHelper {
  private static readonly SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private static readonly TOKEN_EXPIRY = '24h'; // Token expires in 24 hours

  /**
   * Generate a JWT token
   */
  static generateToken(payload: TokenPayload): string {
    try {
      return jwt.sign(payload, this.SECRET_KEY, {
        expiresIn: this.TOKEN_EXPIRY,
      });
    } catch (error) {
      throw new Error('Error generating token');
    }
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.SECRET_KEY) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload | null;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return true;

      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Refresh token (generate new token with same payload)
   */
  static refreshToken(token: string): string {
    try {
      const payload = this.verifyToken(token);
      return this.generateToken(payload);
    } catch (error) {
      throw new Error('Cannot refresh invalid token');
    }
  }
}
