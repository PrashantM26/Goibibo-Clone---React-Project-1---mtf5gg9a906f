import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import axios from "axios";
import { LoginSignup } from "./LoginSignup.css"

//export const SignUp = ({setShowSignUp, showSignUp, setUserName, setShow, show}) => {
export const SignUp = ({setShowSignUp, showSignUp}) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { setIsLoggedIn, show, setShow, setUserLoginName } = useAuth();

  const createUser = async (user) => {
    const config = {
            headers: {
            projectID: "zvc3foel7gfi"
            }
        }
    try {
      const res = await axios.post(
        "https://academics.newtonschool.co/api/v1/bookingportals/signup",
        { ...user, appType: "bookingportals" },
        config
      );
      console.log("res", res);
      const token = res.data.token;
      if (token) {
        sessionStorage.removeItem("user-token");
        sessionStorage.setItem("user-token", token);
        sessionStorage.setItem(
          "user-name",
          JSON.stringify(res.data.data.user.name)
        );
        setShow(!show)
        setIsLoggedIn(true);
        setUserLoginName(user.name)
        navigate("/flights");
      }
    } catch (err) {
      alert("Error occurred ", err);
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userDetails = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    createUser(userDetails);
  };

  return (
    <div>
      <form action=""  onSubmit={handleFormSubmit}>
        <h2>SignUp</h2>
        <label htmlFor="name">Name: </label>
        <div className="login-details">
          <input className="input-box-login" type="text" name="name" id="name" ref={nameRef} />
        </div>
          <label htmlFor="email">Email: </label>
        <div className="login-details">
          <input className="input-box-login" type="email" name="email" id="email" ref={emailRef} />
        </div>
          <label htmlFor="password">Password: </label>
        <div className="login-details">
          <input className="input-box-login" type="password" name="password" id="password" ref={passwordRef} />
        </div>
        <div className="login-button-holder">
          <button className="login-btn" type="submit" value="SignUp">Sign Up</button>
          <button className="login-btn" value="toLogin" onClick={() => setShowSignUp(false)}>Already Signed Up?</button>
        </div>
      </form>
    </div>
  );
}






















//export const Login = ({setShow, show, setUserName}) => {
  export const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const {setIsLoggedIn, show, setShow, setUserLoginName} =  useAuth();
    const {state} = useLocation();
    const [showSignUp, setShowSignUp] = useState(false);
  
    const loginUser = async (user) => {
      const config = {
          headers: {
          projectID: "zvc3foel7gfi"
          }
      }
      try {
        const res = await axios.post(
          "https://academics.newtonschool.co/api/v1/bookingportals/login",
          { ...user, appType: "bookingportals" },
          config
        );
        //console.log("res", res);
        const token = res.data.token;
        if (token) {
          console.log("TOKEN FROM LOGIN", token)
          sessionStorage.removeItem("user-token");
          sessionStorage.setItem("user-token", token);
          sessionStorage.setItem("user-name", JSON.stringify(res.data.data.name));
          setIsLoggedIn(true);
          setUserLoginName(res.data.data.name)
          if(state){
            navigate(state.prevPath);
          }else{
            navigate("/flights")
          }
          setShow(!show)
        }
      } catch (err) {
        console.log(err)
        alert("Error occurred, check credentials ", err);
      }
    };
    
    const handleFormSubmit = (e) => {
      e.preventDefault();
      const userDetails = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      loginUser(userDetails);
    };

  return (
    <>
      {show ?
          <div className="log-in">
            
                  <div className="modal-content-login" action="">
                      <div className="left-container-login">
                          <div>
                              <h3>
                                  <span>Smooth</span> Bus Rides
                              </h3>
                              
                              <ul className="benefits-container-login">
                                  <li className="itemsLogin">
                                      <span className="benefits-img-login"></span>
                                      <span className="benefitsLogin">Track live bus location</span>
                                  </li>
                                  <li className="itemsLogin">
                                      <span className="benefits-img-login"></span>
                                      <span className="benefitsLogin">Exclusive bus operator deals</span>
                                  </li>
                                  <li className="itemsLogin">
                                      <span className="benefits-img-login"></span>
                                      <span className="benefitsLogin">Manage and modify bookings</span>
                                  </li>
                              </ul>
                          </div>
                      </div>
                      <div className="right-container-login">
                          <div>
                            {!showSignUp ? 
                              (                    
                              <form onSubmit={handleFormSubmit}>
                                  <h2 >Login</h2>
                                  <label htmlFor="email">Email: </label>
                                  <div className="login-details">
                                      <input className="input-box-login" type="email" name="email" id="email" ref={emailRef} />                                   
                                  </div>
                                  <label htmlFor="password">Password: </label>
                                  <div className="login-details">                                   
                                      <input className="input-box-login"
                                      type="password"
                                      name="password"
                                      id="password"
                                      ref={passwordRef}
                                      />
                                  </div>
                                  <div className="login-button-holder">
                                      <button type="submit" className="login-btn" value="Login">Continue</button>
                                      <button type="button" className="login-btn" value="toSignUp" onClick={() => {setShowSignUp(true)}}>Or SignUp</button>
                                  </div>
                              </form>
                              )         
                              :  <SignUp setShowSignUp={setShowSignUp} showSignUp={showSignUp} /> }
                              {/*<SignUp setShowSignUp={setShowSignUp} showSignUp={showSignUp} setUserName={setUserName} setShow={setShow} show={show} />*/}
                            
                              
                          </div>
                          <div>
                              <p className="privacy-policy-login">By proceeding, you agree to GoIbibo’s <a href>Privacy Policy</a>, <a href>User Agreement</a>  and <a href>Terms of Service</a></p>
                          </div>
                          <div className="close-login-btn" >
                              <button onClick={() => {setShow(!show)}}>Close</button>
                          </div>
                      </div>
                  </div>
              
            </div>
        : null }
    </>
  )
}


























/*export const Login = () => { 
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const {setIsLoggedIn} =  useAuth();
  const {state} = useLocation();

  const loginUser = async (user) => {
    const config = {
        headers: {
        projectId: "zvc3foel7gfi"
        }
    }
    try {
      const res = await axios.post(
        "https://academics.newtonschool.co/api/v1/bookingportals/login",
        { ...user, appType: "bookingportals" },
        config
      );
      console.log("res", res);
      const token = res.data.token;
      if (token) {
        sessionStorage.setItem("userToken", token);
        sessionStorage.setItem("userName", JSON.stringify(res.data.data.name));
        setIsLoggedIn(true);
        if(state){
          navigate(state.prevPath);
        }else{
          navigate("/flights")
        }
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userDetails = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    loginUser(userDetails);
  };

  return (
    <form action="" className="form-container" onSubmit={handleFormSubmit}>
      <h2>Login</h2>
      <div>
        <label htmlFor="email">Email: </label>
        <input type="email" name="email" id="email" ref={emailRef} />
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          id="password"
          ref={passwordRef}
        />
      </div>
      <div>
        <input type="submit" value="Login" />
      </div>
      <button onClick={() => {navigate("/signup")}}>SignUp</button>
    </form>
  );
}*/



























/*
<form >
                                <div id="sign-in-button"></div>
                                <div className="login-details-div">
                                    <span className="mobile-number">Enter your OTP</span>
                                    <span className="india-code">OTP : </span>
                                    <input type="number"  name="otp" className="input-box-for-login" maxlength="10" required/>
                                </div>
                                <div>
                                    <button type="submit" className="login-button">Login</button>
                                </div>
                            </form>
*/