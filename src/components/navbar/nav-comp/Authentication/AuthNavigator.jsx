import React, { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

export const AuthNavigator = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  
 /* return isLoggedIn ? (                           //Ask doubt, leads to abnormal behaviour
    children
  ) : (
    <>
      {/*<Navigate to="/login" state={{ prevPath: pathname }} />*}
      {alert("Please log in")}
    </>
  );
};*/

useEffect(() => {
  if (!isLoggedIn) {
    alert("Please log in");
  }
}, [isLoggedIn, pathname]);

  return isLoggedIn ? children : null;
};