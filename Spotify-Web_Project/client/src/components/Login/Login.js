import React, {useState} from "react";
import {useAppContext} from "../../libs/contextLib";
import axios from 'axios'
import {Redirect} from "react-router-dom";
import video from '../../videos/wap.mp4'


import "./Login.css";

export default function Login() {
  const {isAuthenticated, userHasAuthenticated} = useAppContext();

  const [state, setState] = useState({
    email: "",
    password: ""
  })
  const [userEmail, setUserEmail] = useState("");
  const [loginError, setLoginError] = useState(null);

  const handleChange = (e) => {
    const {id, value} = e.target
    setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleSubmitClick = (e) => {
    e.preventDefault();
    try {
      if (state.email === "") {
        alert("email cannot be null");
      } else if (state.password === "") {
        alert("password cannot be null");
      } else {
        const user = {
          email: state.email,
          password: state.password
        };
        try {
          axios.post('http://localhost:5000/users/login', user)
              .then(response => setUserEmail(response.data.email))
              .catch(error => {
                setLoginError(error.message);
              })
        } catch (error) {
          console.log(error);
        }
      }
    } catch (e) {
      console.log("error: " + e);
    }
  }

  if (userEmail) {
    userHasAuthenticated(true);
    window.sessionStorage.setItem("userEmail", userEmail);
    window.location.reload(true);
  }

  return (
      <div>
        {isAuthenticated ? (
            <div>
              <Redirect to="/"/>
            </div>
        ) : (
            <div className={classes.Container}>

              <video autoPlay="autoplay" loop="loop" muted className={classes.Video}>
                <source src={video} type="video/mp4"/>
                Your browser does not support the video tag.
              </video>

              <div className={classes.Content}>
                <div className={classes.SubContent}>
                  <form>
                    <h1 class="loginHere">Login Here</h1>
                    {loginError ? (
                        <p class="error">Email or password is wrong</p>
                    ) : (
                        <p></p>
                    )}
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputEmail1">Email</label>
                      <input type="email"
                             className="form-control"
                             id="email"
                             aria-describedby="emailHelp"
                             placeholder="Email"
                             value={state.email}
                             onChange={handleChange}
                      />
                    </div>
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputPassword1">Password</label>
                      <input type="password"
                             className="form-control"
                             id="password"
                             placeholder="Password"
                             value={state.password}
                             onChange={handleChange}
                      />
                    </div>
                    <button
                        class="login"
                        type="submit"
                        className="login"
                        onClick={handleSubmitClick}
                    >
                      Login
                    </button>
                  </form>
                  <a href="http://localhost:3000/register" class="yet">Haven't created an account yet?</a>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
