import React, {useState, useEffect} from 'react';
import "./Register.css";
import axios from 'axios'
import {Redirect} from "react-router-dom";
import video from '../../videos/wap.mp4'

function RegistrationForm(props) {
  const [state, setState] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    email: "",
    password: ""
  })
  const [userEmail, setUserEmail] = useState("");
  const [registerError, setRegisterError] = useState(null);
  console.log("email: " + userEmail);
  console.log("error: " + registerError);

  useEffect(() => {
    onLoad();
  }, [userEmail]);

  async function onLoad() {
    if (userEmail) {
      axios.post('http://localhost:5000/users/signup', {email: userEmail})
    }

  }

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

      if (state.firstname === "") {
        alert("firstname cannot be null");
      } else if (state.lastname === "") {
        alert("lastname cannot be null");
      } else if (state.gender === "") {
        alert("gender cannot be null");
      } else if (state.email === "") {
        alert("email cannot be null");
      } else if (state.password === "") {
        alert("password cannot be null");
      } else if (state.confirmPassword === "") {
        alert("confirmPassword cannot be null");
      }
      if (state.password === state.confirmPassword) {
        const user = {
          firstName: state.firstname,
          lastName: state.lastname,
          gender: state.gender,
          email: state.email,
          password: state.password
        };
        try {
          axios.post('http://localhost:5000/users/add', user)
              .then(response => setUserEmail(response.data.email))
              .catch(error => {
                setRegisterError(error.message);
              })

        } catch (error) {
          console.log(error);
        }
      } else {
        alert("two passwords are different");

      }
    } catch (e) {
      console.log("error: " + e);
    }
  }

  return (
      <div>
        {userEmail ? (
            <div>
              <Redirect to="/login"/>
            </div>
        ) : (
            <div className={classes.Container}>
              <video autoPlay="autoplay" loop="loop" muted className={classes.Video}>
                <source src={video} type="video/mp4"/>
                Your browser does not support the video tag.
              </video>

              <div className={classes.Content}>
                <div className={classes.SubContentRegister}>
                  <form>

                    <h1 class="registerHere">Register Here</h1>

                    {registerError ? (
                        <p class="error">Email is already used or one of fileds is empty</p>
                    ) : (
                        <p></p>
                    )}
                    <div className="form-group text-left">
                      <label>First Name</label>
                      <input type="text"
                             className="form-control"
                             id="firstname"
                             placeholder="First Name"
                             value={state.firstname}
                             onChange={handleChange}
                      />
                    </div>
                    <div className="form-group text-left">
                      <label>Last Name</label>
                      <input type="text"
                             className="form-control"
                             id="lastname"
                             placeholder="Last Name"
                             value={state.lastname}
                             onChange={handleChange}
                      />
                    </div>
                    <div className="form-group text-left">
                      <label>Gender</label>
                      <input type="text"
                             className="form-control"
                             id="gender"
                             placeholder="Gender"
                             value={state.gender}
                             onChange={handleChange}
                      />
                    </div>
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputEmail1">Email address</label>
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
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputPassword1">Confirm Password</label>
                      <input type="password"
                             className="form-control"
                             id="confirmPassword"
                             placeholder="Confirm Password"
                             value={state.confirmPassword}
                             onChange={handleChange}
                      />
                    </div>
                    <button type="submit" className="register" onClick={handleSubmitClick}>
                      Register
                    </button>
                  </form>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}

export default RegistrationForm;
