import { StorageUtils } from "./StorageUtils";

export const AuthUtils = {
  getUser: () => {
    return StorageUtils.getLocal('user');
  },

  isAuth: () => {
    return !!StorageUtils.getLocal('user');
  }
}