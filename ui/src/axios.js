import axios from "axios";
import { store } from "./store";

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
    Promise.reject(err);
  }
);

export default instance;
