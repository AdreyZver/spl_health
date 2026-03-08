import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { HeaderComponent } from "../../components/Header/Header";
import { useAuth } from "../../hooks/useAuth";
import { MainLayout } from "../../layouts/MainLayout";
import { StorageUtils } from "../../utils/StorageUtils";

export const REDIRECT_AFTER_LOGIN_KEY = "redirectAfterLogin";

const saveRedirectAfterLogin = (pathname) => {
  if (StorageUtils.getLocal(REDIRECT_AFTER_LOGIN_KEY)) {
    StorageUtils.removeLocal(REDIRECT_AFTER_LOGIN_KEY);
  }
  StorageUtils.setLocal(REDIRECT_AFTER_LOGIN_KEY, pathname);
}

export const ProtectedRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    saveRedirectAfterLogin(location.pathname);

    return <Navigate to="/login" />;
  }

  return (
    <div>
      <HeaderComponent />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </div>
  );
};