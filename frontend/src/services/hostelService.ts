import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * Hostel API Service
 * Handles all hostel-related API calls
 */
class HostelAPIService {
  private client = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  });

  /**
   * Get all hostels
   * GET /hostels
   */
  async getAllHostels() {
    try {
      const response = await this.client.get('/hostels');
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch hostels. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get hostel by ID
   * GET /hostels/:id
   */
  async getHostelById(id: number) {
    try {
      const response = await this.client.get(`/hostels/${id}`);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch hostel. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all rooms
   * GET /rooms
   */
  async getAllRooms() {
    try {
      const response = await this.client.get('/rooms');
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch rooms. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get available rooms
   * GET /rooms/available
   */
  async getAvailableRooms() {
    try {
      const response = await this.client.get('/rooms/available');
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch available rooms. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get rooms by hostel ID
   * GET /rooms/hostel/:hostelId
   */
  async getRoomsByHostelId(hostelId: number) {
    try {
      const response = await this.client.get(`/rooms/hostel/${hostelId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch hostel rooms. Please try again.';
      throw new Error(errorMessage);
    }
  }
}

export default new HostelAPIService();
