import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { NotFound } from "../../pages/NotFound";

export const OrganizationRoutes = () => {
  const { isOrganizationUser } = useAuth();

  if (!isOrganizationUser) {
    return (
      <NotFound />
    );
  }

  return (
    <Outlet />
  );
};