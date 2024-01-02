import React from "react";
import { useAuth } from "./AuthProvider";
import "./LoginSignup.css"

export const Logout = () => {
    const { show, setShow, setUserLoginName, isLoggedIn, setIsLoggedIn } = useAuth();
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserLoginName("Login Or Signup");
        sessionStorage.removeItem("user-name");
        sessionStorage.removeItem("user-token")
    }
    return(
        <div className="logout-container">
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}