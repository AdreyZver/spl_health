import React from "react";
import { Outlet } from "react-router-dom";

export const OpenRoutes = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};