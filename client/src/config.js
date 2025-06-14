export const API_BASE_URL = import.meta.env.PROD
  ? 'https://curiofy-backend.onrender.com'  // Updated production URL
  : window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : `http://${window.location.hostname}:3000`;