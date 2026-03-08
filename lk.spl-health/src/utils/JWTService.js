import { StorageUtils } from "./StorageUtils";
import { TOKEN_KEY } from "../app/constants";

export const JWTService = {
  tokenKey: TOKEN_KEY,

  getToken() {
    return StorageUtils.getLocal(this.tokenKey);
  },

  setToken(token) {
    StorageUtils.setLocal(this.tokenKey, token);
  }
}