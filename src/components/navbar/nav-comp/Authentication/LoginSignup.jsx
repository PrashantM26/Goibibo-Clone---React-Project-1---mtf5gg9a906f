import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { LoginSignup } from "./LoginSignup.css"

export const Signup = () => { 
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const createUser = async (user) => {
    const config = {
            headers: {
            projectId: "zvc3foel7gfi"
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
        sessionStorage.setItem("userToken", token);
        sessionStorage.setItem(
          "userName",
          JSON.stringify(res.data.data.name)
        );
        setIsLoggedIn(true);
        navigate("/flights");
      }
    } catch (err) {
      console.log("Error:", err);
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
    <form action="" className="form-container" onSubmit={handleFormSubmit}>
      <h2>SignUp</h2>
      <div>
        <label htmlFor="name">Name: </label>
        <input type="text" name="name" id="name" ref={nameRef} />
      </div>
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
        <input type="submit" value="SignUp" />
      </div>
    </form>
  );
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















export const Login = ({setShow, show, setUserName, userName}) => { 
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
                        <div className="close-login" >
                            <button onClick={() => {console.log("clicked")
                            setShow(!show)}}>Close</button>
                            console.log("HIIIIIIIT")
                        </div>
                        <div>
                            <h2 >Login</h2>
                            <form >
                                <div className="login-details">

                                    <label htmlFor="email">Email: </label>
                                    <input className="input-box-login" type="email" name="email" id="email" ref={emailRef} />
                                    
                                </div>
                                <div className="login-details">
                                    <label htmlFor="password">Password: </label>
                                    <input className="input-box-login"
                                    type="password"
                                    name="password"
                                    id="password"
                                    ref={passwordRef}
                                    />
                                </div>
                                <div>
                                    <button type="submit" className="login-btn" value="Login">Continue</button>
                                </div>
                                <div>
                                    <button type="submit" className="login-btn" value="Login" onClick={() => {navigate("/signup")}}>Or SignUp</button>
                                </div>
                            </form>
                            <div className="for-space"></div>
                            
                        </div>
                        <div>
                            <p className="privacy-policy-login">By proceeding, you agree to GoIbibo’s <a href>Privacy Policy</a>, <a href>User Agreement</a>  and <a href>Terms of Service</a></p>
                        </div>
                    </div>
                </div>
          </div>

    )
}






















































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