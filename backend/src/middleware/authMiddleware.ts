import { Request, Response, NextFunction } from 'express';
import { TokenHelper, TokenPayload } from '../utils/tokenHelper';

/**
 * Extended Request interface with user info
 */
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware to verify JWT token from Authorization header
 * Usage: router.get('/protected', authMiddleware, controllerMethod)
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authorization token is required',
      });
      return;
    }

    // Verify token
    const payload = TokenHelper.verifyToken(token);
    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to verify JWT token and check if user is a STUDENT
 */
export const studentAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authorization token is required',
      });
      return;
    }

    // Verify token
    const payload = TokenHelper.verifyToken(token);

    // Check if user is a student
    if (payload.role !== 'STUDENT') {
      res.status(403).json({
        success: false,
        message: 'Only students can access this resource',
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to verify JWT token and check if user is an ADMIN
 */
export const adminAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authorization token is required',
      });
      return;
    }

    // Verify token
    const payload = TokenHelper.verifyToken(token);

    // Check if user is an admin
    if (payload.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Only admins can access this resource',
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Helper function to extract token from Authorization header
 * Supports: "Bearer <token>" format
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  // Check for "Bearer <token>" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Also accept token directly
  return authHeader;
}

/**
 * Optional middleware - doesn't fail if token is missing, but validates if present
 */
export const optionalAuthMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (token) {
      const payload = TokenHelper.verifyToken(token);
      req.user = payload;
    }

    next();
  } catch (error) {
    // Ignore token errors and continue
    next();
  }
};
