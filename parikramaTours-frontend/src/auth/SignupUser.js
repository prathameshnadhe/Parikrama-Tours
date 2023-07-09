import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./css/login.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

// Import the entire 'tours' folder using require.context
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const tourImages = importAll(require.context("../images/tours"));
// console.log(tourImages);
// const randomNumber = Math.floor(Math.random() * 9) + 1;

const imageKeys = Object.keys(tourImages);
const randomIndex = Math.floor(Math.random() * imageKeys.length);
const randomImageKey = imageKeys[randomIndex];
const randomImageSrc = tourImages[randomImageKey];

function SignupUser() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/signup",
        {
          name,
          email,
          password,
          passwordConfirm,
        }
      );

      const responseData = response.data;
      console.log(responseData);
      if (responseData.status === "success") {
        const userData = responseData.data.user;
        // save user and token to local storage
        dispatch({ type: "SET_USER_DATA", payload: userData }); // Update user data in the navbar
        toast.success("Register success.");
        navigate("/");
      } else {
        console.log("responseData error", responseData);
      }
      // console.log("REGISTER USER ===> ", res);

      // navigate("/login");
    } catch (error) {
      console.log(error);
      if (error.response.data.error.statusCode === 401) {
        toast.error(error.response.data.message);
      }
      console.log(
        "error.response.data.error.statusCode : ",
        error.response.data.error.statusCode
      );
      if (error.response.data.error.statusCode === 400) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleRegisterClick = () => {
    navigate("/login");
  };

  return (
    <section className="section-data">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img className="img-fluid" alt="Tours" src={randomImageSrc} />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form className="form-data" onSubmit={handleFormSubmit}>
              <h2 className="h2-title">Register Here</h2>
              <br />

              {/* Name input */}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form3Example3">
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email input */}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form3Example3">
                  Email address:
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {email &&
                  !email.match(
                    /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
                  ) && (
                    <small className="text-danger">
                      Valid Email is Required
                    </small>
                  )}
              </div>

              {/* Password input */}
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="form3Example4">
                  Password:
                </label>
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* confirmPassword input */}
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="form3Example4">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password again"
                  value={passwordConfirm}
                  onChange={(e) => setpasswordConfirm(e.target.value)}
                />
              </div>

              <div
                className="text-center text-lg-start mt-4 pt-2"
                style={{ display: "flex", alignItems: "center" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{
                    paddingLeft: "2.5rem",
                    paddingRight: "2.5rem",
                    cursor: "pointer",
                  }}
                  disabled={!email || !password || !name || !passwordConfirm}
                >
                  Signup
                </button>
                <p className="para-small">
                  Do you have an account?
                  <a
                    onClick={handleRegisterClick}
                    className="link-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupUser;
