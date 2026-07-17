import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the token to every request automatically, if one exists
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vaulttv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, log the user out automatically
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vaulttv_token');
      localStorage.removeItem('vaulttv_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;