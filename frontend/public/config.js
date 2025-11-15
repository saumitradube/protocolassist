// Runtime configuration for the application
// This file is loaded at runtime and can be edited without rebuilding
// Note: User-configured URLs in localStorage take precedence over this

(function() {
  // Initialize APP_CONFIG if it doesn't exist
  if (!window.APP_CONFIG) {
    window.APP_CONFIG = {};
  }

  // Only set default if not already configured and on localhost
  if (!window.APP_CONFIG.API_BASE_URL) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.APP_CONFIG.API_BASE_URL = 'http://localhost:8000';
    }
    // For production, leave empty - user will configure via UI
  }

  // You can set a default backend URL here for production:
  // window.APP_CONFIG.API_BASE_URL = 'https://your-backend-url.com';
})();

