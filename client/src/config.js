export const API_BASE_URL =
  import.meta.env.PROD
    ? 'https://curiofy-backend.onrender.com'
    : window.location.hostname === '192.168.1.6'
      ? 'http://192.168.1.6:3000'
      : 'http://localhost:3000';