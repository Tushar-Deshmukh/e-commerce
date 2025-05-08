import axios from "axios";
import { store } from "./store";
import storage from 'redux-persist/lib/storage'

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.auth?.user?.token;

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (err) => {
    console.log('error',err)
    Promise.reject(err);
  }
);

// Response Interceptor for 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Clear persisted storage (localStorage)
      await storage.removeItem('persist:root')

      // Dispatch sign out
      store.dispatch(setSignOut())

    }

    return Promise.reject(error)
  }
)

export default instance;
