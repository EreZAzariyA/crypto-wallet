import axios from "axios";
import store from "../redux/store";
import { logoutAction } from "../redux/actions/auth-actions";
import { getError } from "../utils/helpers";

class InterceptorsService {
  public createInterceptors(): void {
    axios.interceptors.request.use((request) => {

      const token = store.getState().auth.token;
      if (token && typeof token === 'string') {
        request.headers["Authorization"] = `Bearer ${token}`;
      }

      if (import.meta.env.PROD) {
        request.headers["ngrok-skip-browser-warning"] = true;
      }
      request.withCredentials = true;

      return request;
    }, ((err) => console.log({ 'interceptorsService': err })));

    axios.interceptors.response.use((response) => {
      return response;
    }, (err) => {
      if (err.response?.status === 401) {
        store.dispatch(logoutAction());
      }

      return Promise.reject(getError(err));
    });
  };
};

const interceptorsService = new InterceptorsService();
export default interceptorsService;