import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

export const AuthNavigator = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  console.log("isLoggedIn:", isLoggedIn);
  return isLoggedIn ? (
    children
  ) : (
    <>
      {/*<Navigate to="/login" state={{ prevPath: pathname }} />*/}
      {alert("Please log in")}
    </>
  );
};