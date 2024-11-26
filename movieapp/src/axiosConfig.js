import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(accessToken) {
  refreshSubscribers.map((callback) => callback(accessToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// Request Interceptor: Attach Access Token
instance.interceptors.request.use(
  (config) => {
    const userFromSessionStorage = sessionStorage.getItem('user');
    if (userFromSessionStorage) {
      const user = JSON.parse(userFromSessionStorage);
      if (user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        const userFromSessionStorage = sessionStorage.getItem('user');
        if (userFromSessionStorage) {
          const user = JSON.parse(userFromSessionStorage);
          const refreshToken = user.refreshToken;

          return axios
            .post(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/token`, { token: refreshToken })
            .then((res) => {
              isRefreshing = false;
              const newAccessToken = res.data.accessToken;

              // Update accessToken in user state
              user.accessToken = newAccessToken;
              sessionStorage.setItem('user', JSON.stringify(user));

              onRefreshed(newAccessToken);

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            })
            .catch((err) => {
              console.error('Refresh token error:', err);
              // Handle refresh token expiration (e.g., redirect to login)
              return Promise.reject(err);
            });
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((accessToken) => {
          originalRequest.headers.Authorization = 'Bearer ' + accessToken;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default instance;