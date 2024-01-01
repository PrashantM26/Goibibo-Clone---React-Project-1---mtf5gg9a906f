import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  // let isUserLoggedIn;
  // const token = sessionStorage.getItem("userToken");
  // if(token){
  //   isUserLoggedIn = true
  // }else{
  //   isUserLoggedIn = false
  // }
  let isUserLoggedIn = sessionStorage.getItem("userToken") ? true : false;
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);
  
  const [show,setShow]=useState(true)
  const [userLoginName, setUserLoginName] = useState("Login Or Signup")
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, show, setShow, userLoginName, setUserLoginName }}>
        {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
   return useContext(AuthContext);
}