

/**
 * NOTELY FRONTEND API CLIENT - HTTP REQUEST MANAGEMENT
 * 
 * This file implements a centralized API client for the Notely frontend application.
 * It provides a clean, type-safe interface for making HTTP requests to the backend
 * with automatic authentication, error handling, and request/response interceptors.
 * 
 * Key Features:
 * - Automatic JWT token attachment for authenticated requests
 * - Centralized error handling with user-friendly messages
 * - Type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Environment-based API URL configuration
 * - Request/response interceptors for cross-cutting concerns
 * 
 * Architecture Pattern: This follows the Repository pattern, providing a clean
 * abstraction layer between the UI components and the HTTP API.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

// API Base URL Configuration
// Uses environment variable with fallback to development backend port
// VITE_API_URL should be set in .env file for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * ApiClient Class - Centralized HTTP Client
 * 
 * This class encapsulates all HTTP communication with the backend API.
 * It provides a consistent interface for making requests while handling
 * common concerns like authentication, error handling, and response parsing.
 * 
 * Design Benefits:
 * - Single source of truth for API configuration
 * - Consistent error handling across the application
 * - Automatic authentication token management
 * - Type safety for request/response data
 * - Easy to mock for testing
 */
class ApiClient {
  private api: AxiosInstance

  /**
   * Constructor - Initialize Axios Instance
   * 
   * Sets up the base Axios configuration with default headers and interceptors.
   * The interceptors handle cross-cutting concerns that apply to all requests.
   * 
   * @param baseURL - The base URL for all API requests
   */
  constructor(baseURL: string ) {
    // Create Axios instance with base configuration
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json' // Default content type for JSON APIs
      }
    })

    /**
     * Request Interceptor - Automatic Authentication
     * 
     * This interceptor runs before every request is sent to automatically
     * attach the JWT authentication token if one exists in localStorage.
     * 
     * Authentication Flow:
     * 1. Check localStorage for stored JWT token
     * 2. If token exists, add Authorization header
     * 3. If no token, request proceeds without authentication
     * 
     * Security Note: JWT tokens are stored in localStorage for simplicity,
     * but in production, consider more secure storage options like httpOnly cookies.
     */
    this.api.interceptors.request.use((config) => {
      // Retrieve JWT token from browser's localStorage
      const token = localStorage.getItem('token')
      
      // If token exists, add it to the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      return config // Continue with the modified request configuration
    })

    /**
     * Response Interceptor - Error Handling and Data Extraction
     * 
     * This interceptor processes all responses and errors to provide consistent
     * data handling and user-friendly error messages throughout the application.
     * 
     * Success Response Handling:
     * - Automatically extracts data from Axios response wrapper
     * - Returns just the response.data for cleaner component code
     * 
     * Error Response Handling:
     * - Extracts meaningful error messages from various response formats
     * - Provides fallback messages for unexpected error structures
     * - Throws Error objects with user-friendly messages
     */
    this.api.interceptors.response.use(
      // Success handler - extract data from response wrapper
      (response) => response.data,
      
      // Error handler - extract and format error messages
      (error) => {
        let message = 'Something went wrong' // Default fallback message
        
        // Extract error message from response data if available
        if (error.response?.data) {
          if (typeof error.response.data === 'object' && error.response.data.message) {
            // Standard API error format: { message: "Error description" }
            message = error.response.data.message
          } else if (typeof error.response.data === 'string') {
            // Plain string error response
            message = error.response.data
          } else if (typeof error.response.data === 'object') {
            // Complex object - stringify for debugging
            message = JSON.stringify(error.response.data)
          }
        } else if (error.message) {
          // Network or other Axios errors
          message = error.message
        } else if (error.response?.statusText) {
          // HTTP status text fallback
          message = error.response.statusText
        }
        
        // Throw a new Error with the extracted message
        // This ensures consistent error handling in components
        throw new Error(message)
      }
    )
  }

  /**
   * GET Request Method
   * 
   * Performs HTTP GET requests for data retrieval operations.
   * Commonly used for fetching user data, notes, and other resources.
   * 
   * @param endpoint - API endpoint path (relative to base URL)
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the response data
   */
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get(endpoint, config)
  }

  /**
   * POST Request Method
   * 
   * Performs HTTP POST requests for creating new resources.
   * Commonly used for user registration, creating notes, and authentication.
   * 
   * @param endpoint - API endpoint path (relative to base URL)
   * @param data - Request body data to send
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the response data
   */
  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post(endpoint, data, config)
  }

  /**
   * PUT Request Method
   * 
   * Performs HTTP PUT requests for complete resource updates.
   * Used when replacing an entire resource with new data.
   * 
   * @param endpoint - API endpoint path (relative to base URL)
   * @param data - Complete resource data to replace existing data
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the response data
   */
  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put(endpoint, data, config)
  }

  /**
   * PATCH Request Method
   * 
   * Performs HTTP PATCH requests for partial resource updates.
   * Used when updating only specific fields of a resource.
   * 
   * @param endpoint - API endpoint path (relative to base URL)
   * @param data - Partial resource data with only fields to update
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the response data
   */
  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.patch(endpoint, data, config)
  }

  /**
   * DELETE Request Method
   * 
   * Performs HTTP DELETE requests for resource removal.
   * Used for deleting notes, user accounts, and other resources.
   * 
   * @param endpoint - API endpoint path (relative to base URL)
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to the response data
   */
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete(endpoint, config)
  }
}

/**
 * Singleton API Client Instance
 * 
 * Export a pre-configured instance of the ApiClient for use throughout
 * the application. This ensures consistent configuration and prevents
 * multiple instances with different settings.
 * 
 * Usage in components:
 * ```typescript
 * import { apiClient } from './utils/api'
 * 
 * const notes = await apiClient.get('/notes')
 * const newNote = await apiClient.post('/notes', { title: 'New Note' })
 * ```
 */
export const apiClient = new ApiClient(API_BASE_URL)
