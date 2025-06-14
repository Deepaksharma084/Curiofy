export const API_BASE_URL = import.meta.env.PROD
  ? 'https://curiofy-backend.onrender.com'  // Make sure no trailing slash
  : 'http://localhost:3000';  // Simplified for development