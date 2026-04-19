import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
class AuthAPIService {
  private client = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  });

  /**
   * Student Login
   * POST /auth/student/login
   */
  async studentLogin(email: string, password: string) {
    try {
      const response = await this.client.post('/auth/student/login', {
        email,
        password,
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('userType', 'student');
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to login. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Admin Login
   * POST /auth/admin/login
   */
  async adminLogin(email: string, password: string) {
    try {
      const response = await this.client.post('/auth/admin/login', {
        email,
        password,
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to login. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Student Register
   * POST /auth/student/register
   */
  async studentRegister(
    name: string,
    email: string,
    password: string,
    department: string,
    year: number,
    phoneNumber?: string,
    address?: string
  ) {
    try {
      const response = await this.client.post('/auth/student/register', {
        name,
        email,
        password,
        department,
        year,
        phoneNumber,
        address,
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('userType', 'student');
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to register. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Admin Register
   * POST /auth/admin/register
   */
  async adminRegister(name: string, email: string, password: string) {
    try {
      const response = await this.client.post('/auth/admin/register', {
        name,
        email,
        password,
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to register. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Verify Token
   * POST /auth/verify
   */
  async verifyToken(token: string) {
    try {
      const response = await this.client.post(
        '/auth/verify',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorMessage = 'Token verification failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Logout (client-side only)
   * Clears stored tokens and user data
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get Authorization header for API requests
   */
  getAuthHeader() {
    const token = this.getToken();
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {};
  }
}

export default new AuthAPIService();
