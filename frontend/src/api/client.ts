/** API client configuration. */
import axios from 'axios';
import { getApiBaseUrl, loadApiBaseUrlFromStorage, setApiBaseUrl } from '../utils/config';

// Get API URL from runtime config, localStorage, or defaults
let API_BASE_URL = loadApiBaseUrlFromStorage() || getApiBaseUrl();

// If no URL is configured (production without backend URL), we'll handle it in the interceptor
export const apiClient = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000', // Fallback, but won't be used if empty
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update base URL dynamically
export function updateApiBaseUrl(url: string): void {
  setApiBaseUrl(url);
  apiClient.defaults.baseURL = url;
}

// Get current API base URL
export function getCurrentApiBaseUrl(): string {
  return apiClient.defaults.baseURL || '';
}

// Request interceptor - check if URL is configured before making request
apiClient.interceptors.request.use(
  (config) => {
    // If baseURL is empty or localhost but we're on GitHub Pages, it's a configuration issue
    const currentUrl = config.baseURL || apiClient.defaults.baseURL;
    if (!currentUrl || currentUrl === 'http://localhost:8000') {
      const isProduction = window.location.hostname.includes('github.io') || 
                          window.location.hostname.includes('github.com');
      if (isProduction && (!currentUrl || currentUrl === 'http://localhost:8000')) {
        // This will be handled by the App component showing the config modal
        console.warn('API URL not configured for production');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

