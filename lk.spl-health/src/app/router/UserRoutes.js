import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { NotFound } from "../../pages/NotFound";

export const UserRoutes = () => {
  const { isOrdinaryUser } = useAuth();

  if (!isOrdinaryUser) {
    return (
      <NotFound />
    );
  }

  return (
    <Outlet />
  );
};