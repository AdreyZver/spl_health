import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { StorageUtils } from "../utils/StorageUtils";
import { TOKEN_KEY, USER_KEY, GROUPS_KEY, UserGroups } from "./constants";
import { REDIRECT_AFTER_LOGIN_KEY } from "./router/ProtectedRoutes";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useLocalStorage(USER_KEY, null);
  const [jwtToken, setJwtToken] = useLocalStorage(TOKEN_KEY, null);
  const navigate = useNavigate();

  const login = async (data) => {
    setUser(data.user);
    setJwtToken(data.token.replace(/\"/g, ""));

    const redirectAfterLoginPage = StorageUtils.getLocal(REDIRECT_AFTER_LOGIN_KEY);
    StorageUtils.removeLocal(REDIRECT_AFTER_LOGIN_KEY);

    return () => navigate(redirectAfterLoginPage ? redirectAfterLoginPage : "/profile");
  };

  const logout = () => {
    setUser(null);
    setJwtToken(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      jwtToken,
      groups: user?.groupCodes,
      isOrganizationUser: !!(user?.groupCodes?.includes(UserGroups.organization)),
      isOrdinaryUser: !(user?.groupCodes && !!(user?.groupCodes?.length))
    }), [user, jwtToken]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
