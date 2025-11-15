/** Runtime configuration utilities. */

declare global {
  interface Window {
    APP_CONFIG?: {
      API_BASE_URL?: string;
    };
  }
}

/**
 * Get the API base URL from runtime configuration.
 * Falls back to environment variable or localhost for development.
 */
export function getApiBaseUrl(): string {
  // 1. Check localStorage first (user-configured)
  const stored = loadApiBaseUrlFromStorage();
  if (stored) {
    return stored;
  }

  // 2. Check runtime config (from config.js)
  if (window.APP_CONFIG?.API_BASE_URL) {
    return window.APP_CONFIG.API_BASE_URL;
  }

  // 3. Check build-time environment variable
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  // 4. Auto-detect: if on localhost, use localhost backend
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === ''
  ) {
    return 'http://localhost:8000';
  }

  // 5. For production (GitHub Pages), return empty to show config UI
  return '';
}

/**
 * Set the API base URL in runtime config.
 */
export function setApiBaseUrl(url: string): void {
  if (!window.APP_CONFIG) {
    window.APP_CONFIG = {};
  }
  window.APP_CONFIG.API_BASE_URL = url;
  // Save to localStorage for persistence
  localStorage.setItem('API_BASE_URL', url);
}

/**
 * Load API base URL from localStorage if available.
 */
export function loadApiBaseUrlFromStorage(): string | null {
  return localStorage.getItem('API_BASE_URL');
}

