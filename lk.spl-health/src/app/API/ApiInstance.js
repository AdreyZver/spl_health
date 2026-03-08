import axios from "axios";
import { JWTService } from "../../utils/JWTService";
import { baseApiUrl } from "../config";

const instance = axios.create({
  baseURL: baseApiUrl,
});

instance.interceptors.request.use(
  (config) => {
    const token = JWTService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    // Access Token was expired
    if (
      (err?.response?.status === 403 || err?.response?.status === 401) && !originalConfig?.sent
    ) {
      try {
        const rs = await instance.post("/auth/refresh-token", {
          token: JWTService.getToken(),
        });

        const { token } = rs.data;
        JWTService.setToken(token);

        return instance({
          ...originalConfig,
          headers: {
            ...originalConfig.headers,
            'Authorization': `Bearer ${token}`
          },
          sent: true
        });
      } catch (_error) {
        return Promise.reject(_error);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;